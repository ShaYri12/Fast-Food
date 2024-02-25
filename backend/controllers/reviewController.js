import Menu from '../models/Menu.js'
import Review from '../models/Review.js'


export const createReview = async(req, res) =>{
    const menuId = req.params.menuId;
    const newReview = new Review({...req.body})
    try{
        const savedReview = await newReview.save();
        
        await Menu.findByIdAndUpdate(menuId,{
            $push: {reviews: savedReview._id}
        })
        res.status(200).json({
            success: true,
            message: "Review Submitted",
            data: savedReview,
        })
    }catch(error)
    {
        res.status(500).json({
            success: false,
            message: "Failed to submit",
        })
    }
}