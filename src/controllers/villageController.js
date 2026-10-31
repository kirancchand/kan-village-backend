const e = require("express");
const model = require("../models/villageModel");

exports.getKeyValue = async (req, res) => {
    try {
        const result = await model.getKeyValue(req.body);
        res.json(result);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

exports.createVillageApp = async (req, res) => {
    try {
        const data = await model.createVillageApp(req.body);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getVillageApps = async (req, res) => {
    try {
        const result = await model.getVillageApps(req.body);
        res.json(result);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

exports.getApp = async (req, res) => {
    try {
        const appId = req.headers['x-app-id']; // header names are lowercase
        const result = await model.getApp(appId);
        res.json(result);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

exports.updateVillageApp = async (req, res) => {
    try {
        const data = await model.updateVillageApp(req.body);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.deleteVillageApp = async (req, res) => {
    try {
        const data = await model.deleteVillageApp(req.body);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}



exports.createCarousel = async (req, res) => {
    try {
        const baseUrl = `${req.protocol}://${req.get("host")}/uploads/`;

        const imagePath = req.file
            ? `${baseUrl}${req.file.filename}`
            : null;

        const payload = {
            ...req.body,
            carousel_image: imagePath
        };

        const result = await model.createCarousel(payload);

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    // try {
    //     const baseUrl = `${req.protocol}://${req.get("host")}/uploads/`;

    //     const imagePaths = req.files
    //         ? req.files.map((file) => `${baseUrl}${file.filename}`)
    //         : [];

    //     const payload = {
    //         ...req.body,
    //         carousel_image: imagePaths
    //     };

    //     const result = await model.createCarousel(payload);

    //     res.json(result);
    // } catch (err) {
    //     res.status(500).json({ error: err.message });
    // }
};

exports.getCarousel = async (req, res) => {
    try {
        const data = await model.getCarousel(req.body);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getVillageCarousel = async (req, res) => {
    try {
        const appId = req.headers['x-app-id']; // header names are lowercase
        const data = await model.getVillageCarousel(appId);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getVillageMobCarousel = async (req, res) => {
    try {
        const appId = req.headers['x-app-id']; // header names are lowercase
        const data = await model.getVillageMobCarousel(appId);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};




exports.updateCarousel = async (req, res) => {

    try {
        const baseUrl = `${req.protocol}://${req.get("host")}/uploads/`;

        const imagePath = req.file
            ? `${baseUrl}${req.file.filename}`
            : null;

        const payload = {
            ...req.body,
            carousel_image: imagePath == null ? req.body.carousel_image : imagePath
        };

        const result = await model.updateCarousel(payload);

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }


    // try {
    //     const data = await model.updateCarousel(req.body);
    //     res.status(200).json(data);
    // } catch (err) {
    //     res.status(500).json({ error: err.message });
    // }
}

exports.deleteCarousel = async (req, res) => {
    try {
        const data = await model.deleteCarousel(req.body);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.createOrganisation = async (req, res) => {
    try {
        const data = await model.createOrganisation(req.body);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOrganisations = async (req, res) => {
    try {
        const data = await model.getOrganisations(req.body);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateOrganisation = async (req, res) => {
    try {
        const data = await model.updateOrganisation(req.body);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.deleteOrganisation = async (req, res) => {
    try {
        const data = await model.deleteOrganisation(req.body);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getEmergencyOrganisation = async (req, res) => {
    try {
        const appId = req.headers['x-app-id']; // header names are lowercase
        const data = await model.getEmergencyOrganisation(appId);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getOrganisationByCategory = async (req, res) => {
    try {
        const appId = req.headers['x-app-id']; // header names are lowercase
        const category = req.body.category; // get category from query parameters
        const data = await model.getOrganisationByCategory(appId, category);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
exports.getCategories = async (req, res) => {
    try {
        const appId = req.headers['x-app-id']; // header names are lowercase
        const data = await model.getCategories(appId);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.createAdvertisement = async (req, res) => {
    try {
        const baseUrl = `${req.protocol}://${req.get("host")}/uploads/`;

        const imagePath = req.file
            ? `${baseUrl}${req.file.filename}`
            : null;
        console.log(imagePath)
        const payload = {
            ...req.body,
            advertisement_image: imagePath
        };

        const result = await model.createAdvertisement(payload);

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

    // try {
    //     const data = await model.createAdvertisement(req.body);
    //     res.status(200).json(data);
    // } catch (err) {
    //     res.status(500).json({ error: err.message });
    // }
};

exports.getAdvertisements = async (req, res) => {
    try {
        const data = await model.getAdvertisements(req.body);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getMyAdvertisement = async (req, res) => {
    try {
        const appId = req.headers['x-app-id'];
        const data = await model.getMyAdvertisement(appId);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAdvertisementByOrganisation = async (req, res) => {
    try {
        const organisation_id = req.params.organisation_id;
        const data = await model.getAdvertisementByOrganisation(organisation_id);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getHomeAdvertisement = async (req, res) => {
    try {
        const appId = req.headers['x-app-id'];
        const data = await model.getHomeAdvertisement(appId);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};





exports.updateAdvertisement = async (req, res) => {

    try {
        const baseUrl = `${req.protocol}://${req.get("host")}/uploads/`;

        const imagePath = req.file
            ? `${baseUrl}${req.file.filename}`
            : null;
        const payload = {
            ...req.body,
            advertisement_image: imagePath == null ? req.body.advertisement_image : imagePath
        };

        const result = await model.updateAdvertisement(payload);

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}

exports.deleteAdvertisement = async (req, res) => {
    try {
        const data = await model.deleteAdvertisement(req.body);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.createUser = async (req, res) => {
    try {
        const data = await model.createUser(req.body);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        // const appId = req.headers['x-app-id'];
        const data = await model.getAllUsers({ ...req.body });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const appId = req.headers['x-app-id'];
        const data = await model.getUsers({ ...req.body, appId });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const data = await model.deleteUser(req.body);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const data = await model.updateUser(req.body);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getImportantPersons = async (req, res) => {
    try {
        const appId = req.headers['x-app-id'];
        const data = await model.getImportantPersons({ ...req.body, appId });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.analytics = async (req, res) => {
    try {
        const appId = req.headers['x-app-id'];
        const data = await model.analytics({ appId });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


exports.addProduct = async (req, res) => {
    try {
        const baseUrl = `${req.protocol}://${req.get("host")}/uploads/`;

        const images = req.files
            ? req.files.map(file => `${baseUrl}${file.filename}`)
            : [];

        const payload = {
            ...req.body,
            product_images: images
        };

        const result = await model.addProduct(payload);

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.listProducts = async (req, res) => {
    try {
        const data = await model.listProducts(req.body);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const baseUrl = `${req.protocol}://${req.get("host")}/uploads/`;

        const images = req.files && req.files.length > 0
            ? req.files.map(file => `${baseUrl}${file.filename}`)
            : null;

        const payload = {
            ...req.body,
            product_images: images == null ? req.body.product_images : images
        };

        const result = await model.updateProduct(payload);

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const data = await model.deleteProduct(req.body);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.get_product_images = async (req, res) => {
    try {
        const appId = req.headers['x-app-id'];
        const data = await model.get_product_images({ ...req.body, appId });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

