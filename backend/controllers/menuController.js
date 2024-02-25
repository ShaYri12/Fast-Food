import Menu from '../models/Menu.js'

//create new Menu
export const createMenu = async (req, res) =>{
    const newMenu = new Menu(req.body)
    try{
        const savedMenu = await newMenu.save();
        res.status(200).json({
            success: true,
            message: "Successfully created",
            data: savedMenu,
        });
    }catch(err){
        console.error(err); 
        res.status(500).json({
            success:false,
            message: "Failed to create, Try again",
        })
    }
}

//update
export const updateMenu = async(req, res) =>{

    const id = req.params.id;

    try{
        const updatedMenu = await Menu.findByIdAndUpdate(id,{
            $set: req.body
        }, {new:true})

        res.status(200).json({
            success: true,
            message: "Successfully updated",
            data: updatedMenu,
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Failed to update",
        });
    }
}

//delete
export const deleteMenu = async(req, res) =>{
    const id = req.params.id;

    try{
        await Menu.findByIdAndDelete(id)

        res.status(200).json({
            success: true,
            message: "Successfully deleted",
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Failed to delete",
        });
    }
}

//get Single Menu
export const getSingleMenu = async(req, res) =>{
    const id = req.params.id;
    try{
        const menu = await Menu.findById(id).populate("reviews")
        res.status(200).json({
            success: true,
            message: "Successfully found",
            data: menu,
        });
    }
    catch(err){
        res.status(404).json({
            success: false,
            message: "Not found",
        });
    }
}

/// get all Menus or by category with search
export const getAllMenu = async (req, res) => {
    const page = parseInt(req.query.page) || 0; // Set default value for page
    try {
        const { category, search } = req.query;
        let query = {};

        // Check if category is provided in the query parameters
        if (category) {
            query.category = { $regex: new RegExp(category, 'i') };
        }

        // Check if search is provided in the query parameters
        if (search) {
            query.$or = [
                { title: { $regex: new RegExp(search, 'i') } },
                { desc: { $regex: new RegExp(search, 'i') } },
            ];
        }

        // Use the query directly instead of { query }
        const menus = await Menu.find(query).populate('reviews').skip(page * 8).limit(8);

        if (menus.length === 0) {
            return res.status(404).json({ message: 'No data found for the given category and search' });
        }

        res.status(200).json({ data: menus, message: 'Data Received' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error from getAllMenu' });
    }
};



//get Menu by search
export const getMenuBySearch = async (req, res) => {
    const city = new RegExp(req.query.city, 'i');
    const distance = parseInt(req.query.distance);
    const maxGroupSize = parseInt(req.query.maxGroupSize);
  
    try {
      // Build conditions based on provided parameters
      const conditions = {};
  
      if (city) conditions.city = city;
      if (!isNaN(distance)) conditions.distance = { $gte: distance };
      if (!isNaN(maxGroupSize)) conditions.maxGroupSize = { $gte: maxGroupSize };
  
      const menus = await Menu.find(conditions).populate("reviews");
  
      res.status(200).json({
        success: true,
        message: "Successfully found Menus",
        data: menus,
      });
    } catch (err) {
      res.status(404).json({
        success: false,
        message: "Not found",
      });
    }
  };

//get Special Ones
export const getSpecialOnes = async(req, res) =>{
    try{
        const menus = await Menu.find({special:true}).limit(8).populate("reviews")

        res.status(200).json({
            success: true,
            message: "Successful",
            data: menus,
        });
    }
    catch(err){
        res.status(404).json({
            success: false,
            message: "Not found",
        });
    }
}

// Get Menu Count
export const getMenuCount = async (req, res) => {
    try {
        const { category, search } = req.query;
      // Define the filter object
      const filter = {};
  
      // Check if category is provided in the query parameters
      if (category) {
        filter.category = { $regex: new RegExp(category, 'i') };
      }
  
      // Check if search is provided in the query parameters
      if (search) {
        filter.$or = [
          { title: { $regex: new RegExp(search, 'i') } },
          { desc: { $regex: new RegExp(search, 'i') } },
        ];
      }
  
      // Use the filter to count documents in the Menu collection
      const menuCount = await Menu.countDocuments(filter);
  
      // Respond with the count
      res.status(200).json({
        success: true,
        data: menuCount,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch menu count',
      });
    }
  };