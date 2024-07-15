const Assignment = require("../Models/AssignmentModel");
const AssignAssignments = require("../Models/AssignAssignments");
const User = require("../Models/UserModel");
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
    try {
        const token = req.header('Authorization');
        const decoded = jwt.verify(token, 'assignment');
        const sid = decoded.userId;

        const user = await User.findOne({ _id: sid });
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Filter parameters
        const filter = { sid: sid };

        // Filtering by deadline date range
        if (req.query.startDate && req.query.endDate) {
            filter.deadlineDate = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate)
            };
        }

        // Filtering by minPrice and maxPrice (optional)
        if (req.query.minPrice && req.query.maxPrice) {
            filter.price = {
                $gte: parseFloat(req.query.minPrice),
                $lte: parseFloat(req.query.maxPrice)
            };
        }

        // Sorting parameters
        let sort = {};
        if (req.query.sortBy === 'price') {
            // Sorting by price
            const order = req.query.order === 'desc' ? -1 : 1; // Default to ascending order
            sort = { price: order };
        } else if (req.query.sortBy === 'deadlineDate') {
            // Sorting by deadline date
            const order = req.query.order === 'desc' ? -1 : 1; // Default to ascending order
            sort = { deadlineDate: order };
        } else {
            // Default sorting (if no sortBy is provided, sort by createdAt)
            const order = req.query.order === 'desc' ? -1 : 1;
            sort = { createdAt: order };
        }

        const totalDocuments = await AssignAssignments.countDocuments(filter);

        const showAssignments = await AssignAssignments.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .exec();

        if (showAssignments) {
            res.status(200).json({
                "data": showAssignments,
                "currentPage": page,
                "totalPages": Math.ceil(totalDocuments / limit),
                "status": 200
            });
        } else {
            res.status(401).json({ "message": "No assignments found", "status": 401 });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ "message": error.message, "status": 500 });
    }
};

