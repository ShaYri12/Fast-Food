import Order from '../models/Order.js'


// Create Order
export const createOrder = async (req, res) => {
  try {
    const { userId, items, address, totalAmount} = req.body;

    const newOrder = new Order({
      user: userId,
      items,
      address,
      total: totalAmount,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


//get single Order
export const getOrder = async (req, res) => {
  const id = req.params.id;
  try {
      const order = await Order.find({ user: id });

      if (!order) {
          return res.status(404).json({
              success: false,
              message: "Order not found",
          });
      }

      res.status(200).json({
          success: true,
          message: "Successful",
          data: order,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          success: false,
          message: "Internal Server Error",
      });
  }
};


//update single Order
export const updateOrder = async(req, res) =>{
    const id = req.params.id;
    const { status } = req.body;
    try{
      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

        res.status(200).json({
            success: true,
            message: "Successfully Updated",
            data: updatedOrder,
        })
    }catch(error)
    {
        res.status(404).json({
            success: false,
            message: "Not found",
        })
    }
}

// Delete a Order by ID
export const deleteOrder = async (req, res) => {
    try {
      const OrderId = req.params.id;
      
      const deletedOrder = await Order.findByIdAndDelete(OrderId);
  
      if (!deletedOrder) {
        return res.status(404).json({
            success: false, 
            message: 'Order not found'
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Order deleted successfully'
        });

    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        success: false,
        message: 'Internal Server Error'
      });
    }
  };

//get Order by status
export const getAllOrder = async(req, res)=>{
  try {
    const status = req.query.status;

    const filter = status ? { status } : {};

    const order = await Order.find(filter).sort({ createdAt: -1 })
    res.status(200).json({
      Success: true,
      message: "Successfully Found Orders",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch Orders",
      error: error.message,
    });
  }
};

//Update payment of the order
export const updatePayment = async(req, res)=>{
  const id = req.params.id;
  try{
      const updatedUser = await Order.findByIdAndUpdate(id,{
          $set: req.body
      }, {new:true})

      res.status(200).json({
          success: true,
          message: "Successfully updated",
          data: updatedUser,
      });
  }
  catch(err){
      res.status(500).json({
          success: false,
          message: "Failed to update",
      });
  }
};