//recieve the users infoo
//valiadate the  required info
// send the information to the ai trip planner
//calculate the budget per night
//search mongobd for suitable properties
//send both ai trip paln + matching properties to the user

import { Property } from "../Models/propertymodel.js";
import { planTrip } from "../ai/tripPlanner.js";
import { generateDescription } from "../ai/generateDescription.js";

const createTripPlan = async (req, res) => {
    try {
        const { destination, budget, days, people, interests } = req.body;
        if (!destination || !budget || !days || !people) {
            return res.status(400).json({
                status: "fail",
                message: "please fill in destination, budget, days and people"
            })
        }
        //calling ai trip planner
        const plan = await planTrip({ destination, budget, days, people, interests: interests || [] });

        const perNight = Number(budget) / Number(days);

        const destinationPattern = new RegExp(
            destination.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            "i"
        );

        const properties = await Property.find({
            $and: [
                {
                    $or: [
                        { "address.city": destinationPattern },
                        { "address.area": destinationPattern },
                        { "address.state": destinationPattern }
                    ]
                },
                {
                    $or: [
                        { MaximumGuest: { $gte: Number(people) } },
                        { maximumGuest: { $gte: Number(people) } }
                    ]
                }
            ],
            price: { $lte: perNight }
        }).limit(6);

        res.status(200).json({
            status: "success",
            data: { plan, properties, perNight }
        })

    } catch (error) {
        console.error("Error creating trip plan:", error);
        res.status(500).json({ status: "fail", message: "Internal server error, could not create trip plan" });
    }
}

const writeDescription = async (req, res) => {
    try {
        const description = await generateDescription(req.body);
        res.status(200).json({
            status: "success",
            data: { description }
        });
    } catch (error) {
        res.status(500).json({ 
            status: "fail", 
            message: "Internal server error, could not generate description" 
        });
    }
}

export { createTripPlan, writeDescription };