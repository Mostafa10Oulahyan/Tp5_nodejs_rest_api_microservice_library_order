const mongoose = require("mongoose");

mongoose.model("Order", {
    // CustomerID  -   BookID   -  initialdate   -   deliverydate
    CustomerID: {
        type: mongoose.Types.ObjectId,
        require: true
    },
    BookID: {
        type: mongoose.Types.ObjectId,
        require: true
    },
    initialDate: {
        type: Date,
        require: true
    },
    deliveryDate: {
        type: Date,
        require: true
    }
                           
});
