const path = require("path");

const resourceModel = require("../model/resourceModel");
const fs = require("fs"); //filesystem

const addResource = async (req, res) => {
  //check incoming data
  console.log(req.body);
  console.log(req.files);

  //Destructing the body data
  const { stream, subject } = req.body;

  //validation
  if (!stream || !subject) {
    return res.status(400).json({
      success: false,
      message: "Please enter all the fields",
    });
  }

  // validate if there is image
  if (!req.files || !req.files.image) {
    return res.status(400).json({
      success: false,
      message: "Image not found",
    });
  }

  const { image } = req.files;

  //upload image
  // 1. generate new image name(abc.png)=>(234444-abc.png)
  const imageName = `${Date.now()}-${image.name}`;

  // 2. Make a upload path (/path/upload-directory)
  const imageUploadPath = path.join(
    __dirname,
    `../public/resources/${imageName}`
  );

  // 3. Move to that directory (await, try-catch)
  try {
    await image.mv(imageUploadPath);

    //save to database
    const newResource = new resourceModel({
      stream: stream,
      subject: subject,
      image: imageName,
    });
    const resources = await newResource.save();

    return res.status(201).json({
      success: true,
      message: "Resource added successfully",
      data: resources,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error! ",
      error: error,
    });
  }
};

//Fetch all Resources
const getAllResources = async (req, res) => {
  //try catch
  try {
    const allResources = await resourceModel.find({});
    return res.status(201).json({
      success: true,
      message: "Resource fetched successfully",
      resources: allResources,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};
//fetch single  Resource
const getSingleResource = async (req, res) => {
  //get Resource id from url
  const resourceId = req.params.id;

  //find
  try {
    const resources = await resourceModel.findById(resourceId);

    if (!resources) {
      return res.status(400).json({
        success: false,
        message: "Resource not found",
      });
    }
    return res.status(201).json({
      success: true,
      message: "Resource fetched !",
      resources: resources,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

//delete Resource
const deleteResource = async (req, res) => {
  try {
    await resourceModel.findByIdAndDelete(req.params.id);
    return res.status(201).json({
      success: true,
      message: "Resource deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

const updateResource = async (req, res) => {
  try {
    //if there is image
    if (req.files && req.files.image) {
      // destructing
      const { image } = req.files;

      //upload image to /public/resource folder
      // 1. generate new image name(abc.png)=>(234444-abc.png)
      const imageName = `${Date.now()}-${image.name}`;

      // 2. Make a upload path (/path/upload-directory)
      const imageUploadPath = path.join(
        __dirname,
        `../public/resources/${imageName}`
      );

      //move to folder
      await image.mv(imageUploadPath);

      //add new field to req.body (resourceImage -> name)
      req.body.image = imageName; // image uploaded (generated name)

      // if image is uploaded and req.body is assigned
      if (req.body.image) {
        //find existing resource by id
        const existingResource = await resourceModel.findById(req.params.id);
        if (!existingResource) {
          return res.status(404).json({
            success: false,
            message: "Resources not found",
          });
        }
        //searching in the directory
        const oldImagePath = path.join(
          __dirname,
          `../public/resources/${existingResource.image}`
        );

        //delete from file system
        fs.unlinkSync(oldImagePath);
      }
    }
    // updateResource data
    const updateResource = await resourceModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    return res.status(201).json({
      success: true,
      message: "Resource updated successfully",
      resources: updateResource,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

const paginationResources = async (req, res) => {
  //result per page
  const pageNo = req.query.page || 1;
  //per page
  const resultPerPage = req.query.result || 4;
  try {
    // find all resource skip limit
    const resources = await resourceModel
      .find({})
      .skip((pageNo - 1) * resultPerPage)
      .limit(resultPerPage);

    // if page 6 is requested ,result 0
    if (resources.length == 0) {
      res.status(400).json({
        success: false,
        message: "No Resource found",
      });
    }
    //response
    res.status(201).json({
      success: true,
      message: "Resource Fetched",
      resources: resources,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "No Resource Found",
    });
  }
};

module.exports = {
  addResource,
  getAllResources,
  getSingleResource,
  deleteResource,
  updateResource,
  paginationResources,
};
