const e = require("express");
const db = require("../config/db");


exports.getKeyValue = async (data) => {
    const { requestName } = data;

    let query = "";
    let values = [];

    if (requestName === "getAll_VillageApp") {
        query = `SELECT villageapp_id AS value, villageapp_name AS label FROM villageapp`;
    }
    else if (requestName === "getAll_VillageOrganisation") {
        query = `SELECT villageorganisation_id AS value, organisation_name AS label FROM villageorganisation`;
    }
    else if (requestName === "getAll_AdvType") {
        query = `SELECT adv_type_id AS value, adv_type AS label FROM adv_type`;
    }
    else {
        throw new Error("Invalid requestName");
    }

    const result = await db.query(query, values);
    return result.rows;
};

exports.createVillageApp = async (data) => {
    const { villageapp_name, villageapp_desc, villageapp_about, village_branch_id, village_branch } = data;

    const result = await db.query(
        `INSERT INTO villageapp
        (villageapp_name, villageapp_desc, villageapp_about,village_branch_id,village_branch)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [villageapp_name, villageapp_desc, villageapp_about, village_branch_id, village_branch]
    );

    return result.rows[0];
};

exports.getVillageApps = async (payload) => {

    const {
        start = 0,
        numberofRows = 10,
        filter = [],
        sort = []
    } = payload;

    let query = `SELECT * FROM villageapp`;
    let countQuery = `SELECT COUNT(*) FROM villageapp`;
    let values = [];
    let whereConditions = [];

    /*
    FILTERING
    */

    filter.forEach((item, index) => {
        const columnName = item.columnName;
        const value = item.value;
        whereConditions.push(`${columnName} ILIKE $${index + 1}`);
        values.push(`%${value}%`);

    });

    /*
    WHERE
    */

    if (whereConditions.length > 0) {
        const whereClause = ` WHERE ` + whereConditions.join(" AND ");
        query += whereClause;
        countQuery += whereClause;
    }

    /*
    SORTING
    */

    if (sort.length > 0) {
        const sortClause = sort.map(item => `${item.columnName} ${item.sortOrder}`).join(",");
        query += ` ORDER BY ${sortClause}`;
    } else {
        query += ` ORDER BY villageapp_id DESC`;
    }

    /*
    PAGINATION
    */

    query += ` LIMIT $${values.length + 1}`;
    query += ` OFFSET $${values.length + 2}`;

    values.push(numberofRows);
    values.push(start);

    /*
    EXECUTE
    */
    console.log("query Conditions:", query, values);
    const dataResult = await db.query(query, values);

    /*
    COUNT
    */

    const countValues = values.slice(0, values.length - 2);
    const totalResult = await db.query(countQuery, countValues);
    return {
        totalCount: parseInt(totalResult.rows[0].count),
        result: dataResult.rows
    };
};

exports.getApp = async (appid) => {
    const result = await db.query(`SELECT villageapp_id, villageapp_name,village_branch_id,village_branch FROM villageapp WHERE villageapp_id = $1`, [appid]);
    return result.rows[0];
}


exports.updateVillageApp = async (data) => {
    const { villageapp_id, villageapp_name, villageapp_desc, villageapp_about, village_branch_id, village_branch } = data;

    const result = await db.query(
        `UPDATE villageapp SET 
            villageapp_name=$1,
            villageapp_desc=$2,
            villageapp_about=$3,
            village_branch_id=$4,
            village_branch=$5
            WHERE villageapp_id=$6
        RETURNING *`,
        [villageapp_name, villageapp_desc, villageapp_about, village_branch_id, village_branch, villageapp_id]
    );

    return result.rows[0];
}

exports.deleteVillageApp = async (data) => {
    const { villageapp_id } = data;

    try {
        const result = await db.query(
            `DELETE FROM villageapp WHERE villageapp_id=$1 RETURNING *`,
            [villageapp_id]
        );
        return result.rows[0];
    } catch (err) {
        throw new Error(err.message);
    }
}

exports.createCarousel = async (data) => {
    const {
        carousel_name,
        carousel_image,
        carousel_desc,
        carousel_position,
        isenabled,
        f_villageapp_id,
        ismobile
    } = data;

    const result = await db.query(
        `INSERT INTO villagecarousel
        (carousel_name, carousel_image, carousel_desc, carousel_position, isenabled, f_villageapp_id, ismobile)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [
            carousel_name,
            carousel_image,
            carousel_desc,
            carousel_position,
            isenabled,
            f_villageapp_id,
            ismobile
        ]
    );

    return result.rows[0];
};
// const addProduct = async (req, res) => {
//   try {
//     const { name, category, price, description, rating } = req.body;
//     const baseUrl = `${req.protocol}://${req.get("host")}/uploads/`;
//     const imagePaths = req.files
//       ? req.files.map((file) => `${baseUrl}${file.filename}`)
//       : [];

//     const data = await pool.query(
//       "INSERT INTO inventory.products (name,category,price,images,description,rating) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
//       [name, category, price, imagePaths, description, rating],
//     );
//     res.status(200).json(data.rows[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// };


exports.getCarousel = async (payload) => {

    const {
        start = 0,
        numberofRows = 10,
        filter = [],
        sort = []
    } = payload;

    let query = `SELECT c.*, v.villageapp_name FROM villagecarousel c JOIN villageapp v ON c.f_villageapp_id = v.villageapp_id`;
    let countQuery = `SELECT COUNT(*) FROM villagecarousel c JOIN villageapp v ON c.f_villageapp_id = v.villageapp_id`;
    let values = [];
    let whereConditions = [];

    /*
    FILTERING
    */

    filter.forEach((item, index) => {
        const columnName = item.columnName;
        const value = item.value;
        if (typeof value === "string") {
            whereConditions.push(
                `${columnName} ILIKE $${index + 1}`
            );
            values.push(`%${value}%`);
        }
        if (typeof value === "number") {
            whereConditions.push(
                `${columnName} = $${index + 1}`
            );
            values.push(value);
        }

    });

    /*
    WHERE
    */

    if (whereConditions.length > 0) {
        const whereClause = ` WHERE ` + whereConditions.join(" AND ");
        query += whereClause;
        countQuery += whereClause;
    }

    /*
    SORTING
    */

    if (sort.length > 0) {
        const sortClause = sort.map(item => `${item.columnName} ${item.sortOrder}`).join(",");
        query += ` ORDER BY ${sortClause}`;
    } else {
        query += ` ORDER BY carousel_id DESC`;
    }

    /*
    PAGINATION
    */

    query += ` LIMIT $${values.length + 1}`;
    query += ` OFFSET $${values.length + 2}`;

    values.push(numberofRows);
    values.push(start);

    /*
    EXECUTE
    */
    console.log("query Conditions:", query, values);
    const dataResult = await db.query(query, values);

    /*
    COUNT
    */

    const countValues = values.slice(0, values.length - 2);
    const totalResult = await db.query(countQuery, countValues);
    return {
        totalCount: parseInt(totalResult.rows[0].count),
        result: dataResult.rows
    };
};


exports.getVillageCarousel = async (appId) => {
    let query = `SELECT c.*, v.villageapp_name FROM villagecarousel c JOIN villageapp v ON c.f_villageapp_id = v.villageapp_id WHERE v.villageapp_id = $1 and c.ismobile = false`;
    let values = [appId];

    const dataResult = await db.query(query, values);
    return dataResult.rows
}

exports.getVillageMobCarousel = async (appId) => {
    let query = `SELECT c.*, v.villageapp_name FROM villagecarousel c JOIN villageapp v ON c.f_villageapp_id = v.villageapp_id WHERE v.villageapp_id = $1 and c.ismobile = true`;
    let values = [appId];

    const dataResult = await db.query(query, values);
    return dataResult.rows
}

exports.updateCarousel = async (data) => {
    const {
        carousel_id,
        carousel_name,
        carousel_image,
        carousel_desc,
        carousel_position,
        isenabled,
        f_villageapp_id,
        ismobile
    } = data;

    let query = `UPDATE villagecarousel SET 
            carousel_name=$1,
            carousel_image=$2,
            carousel_desc=$3,
            carousel_position=$4,
            isenabled=$5,
            f_villageapp_id=$6,
            ismobile=$7
            WHERE carousel_id=$8
        RETURNING *`

    let value = [
        carousel_name,
        carousel_image,
        carousel_desc,
        carousel_position,
        isenabled,
        f_villageapp_id,
        ismobile,
        carousel_id
    ]

    const result = await db.query(
        query,
        value
    );
    console.log(query, value)
    return result.rows[0];
}

exports.deleteCarousel = async (data) => {
    const { carousel_id } = data;

    try {
        const result = await db.query(
            `DELETE FROM villagecarousel WHERE carousel_id=$1 RETURNING *`,
            [carousel_id]
        );
        return result.rows[0];
    } catch (err) {
        throw new Error(err.message);
    }
}


exports.createOrganisation = async (data) => {
    const {
        organisation_name,
        organisation_type,
        f_organisation_id,
        f_villageapp_id,
        isemergency,
        priority,
        contact,
        owner, icon
    } = data;

    const result = await db.query(
        `INSERT INTO villageorganisation
        (organisation_name, organisation_type, f_organisation_id,
        f_villageapp_id, isemergency, priority, contact,owner,icon)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *`,
        [
            organisation_name,
            organisation_type,
            f_organisation_id,
            f_villageapp_id.value,
            isemergency,
            priority,
            contact,
            owner,
            icon
        ]
    );

    return result.rows[0];
};

exports.getOrganisations = async (payload) => {
    console.log("Payload:", payload);
    const {
        start = 0,
        numberofRows = 10,
        filter = [],
        sort = []
    } = payload;

    let query = `SELECT * FROM villageorganisation`;
    let countQuery = `SELECT COUNT(*) FROM villageorganisation`;
    let values = [];
    let whereConditions = [];

    /*
    FILTERING
    */

    filter.forEach((item, index) => {
        const columnName = item.columnName;
        const value = item.value;

        if (typeof value === "string") {
            whereConditions.push(
                `${columnName} ILIKE $${index + 1}`
            );
            values.push(`%${value}%`);
        }
        if (typeof value === "number") {
            whereConditions.push(
                `${columnName} = $${index + 1}`
            );
            values.push(value);
        }

    });

    /*
    WHERE
    */
    console.log("filter Conditions:", filter);
    if (whereConditions.length > 0) {
        const whereClause = ` WHERE ` + whereConditions.join(" AND ");
        query += whereClause;
        countQuery += whereClause;
    }

    /*
    SORTING
    */
    console.log("whereConditions Conditions:", sort);
    if (sort.length > 0) {
        const sortClause = sort.map(item => `${item.columnName} ${item.sortOrder}`).join(",");
        query += ` ORDER BY ${sortClause}`;
    } else {
        query += ` ORDER BY villageorganisation_id DESC`;
    }

    /*
    PAGINATION
    */
    console.log("sort Conditions:", sort);
    query += ` LIMIT $${values.length + 1}`;
    query += ` OFFSET $${values.length + 2}`;

    values.push(numberofRows);
    values.push(start);

    /*
    EXECUTE
    */
    console.log("query Conditions:", query, values);
    const dataResult = await db.query(query, values);

    /*
    COUNT
    */
    console.log("dataResult Conditions:", dataResult);
    const countValues = values.slice(0, values.length - 2);
    const totalResult = await db.query(countQuery, countValues);
    return {
        totalCount: parseInt(totalResult.rows[0].count),
        result: dataResult.rows
    };
};

exports.updateOrganisation = async (data) => {
    const {
        villageorganisation_id,
        organisation_name,
        organisation_type,
        f_organisation_id,
        f_villageapp_id,
        isemergency,
        priority,
        contact,
        owner,
        icon
    } = data;

    const result = await db.query(
        `UPDATE villageorganisation SET 
            organisation_name=$1,
            organisation_type=$2,
            f_organisation_id=$3,
            f_villageapp_id=$4,
            isemergency=$5,
            priority=$6,
            contact=$7,
            owner=$8,
            icon=$9
            WHERE villageorganisation_id=$10
        RETURNING *`,
        [
            organisation_name,
            organisation_type,
            f_organisation_id,
            f_villageapp_id.value,
            isemergency,
            priority,
            contact,
            owner,
            icon,
            villageorganisation_id
        ]
    );

    return result.rows[0];
}

exports.deleteOrganisation = async (data) => {
    const { villageorganisation_id } = data;

    try {
        const result = await db.query(
            `DELETE FROM villageorganisation WHERE villageorganisation_id=$1 RETURNING *`,
            [villageorganisation_id]
        );
        return result.rows[0];
    } catch (err) {
        throw new Error(err.message);
    }
};

exports.getEmergencyOrganisation = async (appId) => {
    let query = `SELECT * FROM villageorganisation WHERE f_villageapp_id = $1 AND isemergency = true ORDER BY priority ASC`;
    let values = [appId];

    const dataResult = await db.query(query, values);
    return dataResult.rows;
}

exports.getOrganisationByCategory = async (appId, category) => {
    let addQuery = category == "all" ? `ORDER BY priority ASC` : `AND organisation_type = $2 ORDER BY priority ASC`;
    let values = category == "all" ? [appId] : [appId, category];
    let query = `SELECT * FROM villageorganisation WHERE f_villageapp_id = $1 ` + addQuery;
    console.log("query Conditions:", query, values);
    const dataResult = await db.query(query, values);
    return dataResult.rows;
}

exports.getCategories = async (appId) => {
    let query = `SELECT organisation_type AS cat,icon, COUNT(*) AS count FROM villageorganisation WHERE f_villageapp_id = $1 GROUP BY organisation_type,icon ORDER BY count DESC`;
    let values = [appId];

    const dataResult = await db.query(query, values);
    return dataResult.rows;
}

exports.getAdvertisements = async (payload) => {
    console.log("Payload:", payload);
    const {
        start = 0,
        numberofRows = 10,
        filter = [],
        sort = []
    } = payload;

    let query = `SELECT v.*,va.villageapp_name,vo.organisation_name,at.adv_type 
        FROM villageadvertisement v inner join villageapp va on v.f_villageapp_id=va.villageapp_id
        inner join villageorganisation vo on v.f_villageorganisation_id=vo.villageorganisation_id inner join adv_type at on v.f_adv_type_id=at.adv_type_id`;
    let countQuery = `SELECT COUNT(*) 
        FROM villageadvertisement v inner join villageapp va on v.f_villageapp_id=va.villageapp_id
        inner join villageorganisation vo on v.f_villageorganisation_id=vo.villageorganisation_id inner join adv_type at on v.f_adv_type_id=at.adv_type_id`;
    let values = [];
    let whereConditions = [];

    /*
    FILTERING
    */

    filter.forEach((item, index) => {
        const columnName = item.columnName === "f_villageapp_id"
            ? "v.f_villageapp_id"
            : item.columnName;
        const value = item.value;

        if (typeof value === "string") {
            whereConditions.push(
                `${columnName} ILIKE $${index + 1}`
            );
            values.push(`%${value}%`);
        }
        if (typeof value === "number") {
            whereConditions.push(
                `${columnName} = $${index + 1}`
            );
            values.push(value);
        }

    });

    /*
    WHERE
    */
    console.log("filter Conditions:", filter);
    if (whereConditions.length > 0) {
        const whereClause = ` WHERE ` + whereConditions.join(" AND ");
        query += whereClause;
        countQuery += whereClause;
    }

    /*
    SORTING
    */
    console.log("whereConditions Conditions:", sort);
    if (sort.length > 0) {
        const sortClause = sort.map(item => `${item.columnName} ${item.sortOrder}`).join(",");
        query += ` ORDER BY ${sortClause}`;
    } else {
        query += ` ORDER BY villageadvertisement_id DESC`;
    }

    /*
    PAGINATION
    */
    console.log("sort Conditions:", sort);
    query += ` LIMIT $${values.length + 1}`;
    query += ` OFFSET $${values.length + 2}`;

    values.push(numberofRows);
    values.push(start);

    /*
    EXECUTE
    */
    console.log("query Conditions:", query, values);
    const dataResult = await db.query(query, values);

    /*
    COUNT
    */
    console.log("dataResult Conditions:", dataResult);
    const countValues = values.slice(0, values.length - 2);
    const totalResult = await db.query(countQuery, countValues);
    return {
        totalCount: parseInt(totalResult.rows[0].count),
        result: dataResult.rows
    };
};

exports.getMyAdvertisement = async (appId) => {
    let CURRENT_DATE = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    let query = `SELECT * FROM villageadvertisement WHERE f_villageapp_id = $1 AND start_date <= $2 AND end_date >= $2 AND isexclusive = false ORDER BY start_date ASC`;
    let values = [appId, CURRENT_DATE];

    const dataResult = await db.query(query, values);
    return dataResult.rows;
}

exports.getAdvertisementByOrganisation = async (organisation_id) => {
    let query = `SELECT * FROM villageadvertisement WHERE f_villageorganisation_id = $1 ORDER BY villageadvertisement_id DESC`;
    let values = [organisation_id];

    const dataResult = await db.query(query, values);
    return dataResult.rows;
}

exports.getHomeAdvertisement = async (appId) => {
    let CURRENT_DATE = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    let query = `SELECT * FROM villageadvertisement WHERE f_villageapp_id = $1 AND start_date <= $2 AND end_date >= $2 AND isexclusive = true ORDER BY start_date ASC`;
    let values = [appId, CURRENT_DATE];

    const dataResult = await db.query(query, values);
    return dataResult.rows;
}



exports.createAdvertisement = async (data) => {
    const {
        advertisement_name,
        advertisement_image,
        advertisement_desc,
        start_date,
        end_date,
        isexclusive,
        f_villageapp_id,
        f_villageorganisation_id,
        f_adv_type_id
    } = data;
    console.log(advertisement_image)
    const result = await db.query(
        `INSERT INTO villageadvertisement
        (advertisement_name, advertisement_image,
        advertisement_desc, start_date, end_date, isexclusive,
        f_villageapp_id, f_villageorganisation_id,f_adv_type_id)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *`,
        [
            advertisement_name,
            advertisement_image,
            advertisement_desc,
            start_date,
            end_date,
            isexclusive,
            f_villageapp_id,
            f_villageorganisation_id,
            f_adv_type_id
        ]
    );

    return result.rows[0];
};


exports.updateAdvertisement = async (data) => {
    const {
        villageadvertisement_id,
        advertisement_name,
        advertisement_image,
        advertisement_desc,
        start_date,
        end_date,
        isexclusive,
        f_villageapp_id,
        f_villageorganisation_id,
        f_adv_type_id
    } = data;

    const result = await db.query(
        `UPDATE villageadvertisement SET 
            advertisement_name=$1,
            advertisement_image=$2,
            advertisement_desc=$3,
            start_date=$4,
            end_date=$5,
            isexclusive=$6,
            f_villageapp_id=$7,
            f_villageorganisation_id=$8,
            f_adv_type_id=$9
            WHERE villageadvertisement_id=$10
        RETURNING *`,
        [
            advertisement_name,
            advertisement_image,
            advertisement_desc,
            start_date,
            end_date,
            isexclusive,
            f_villageapp_id,
            f_villageorganisation_id,
            f_adv_type_id,
            villageadvertisement_id
        ]
    );

    return result.rows[0];

}

exports.deleteAdvertisement = async (data) => {
    const { villageadvertisement_id } = data;

    try {
        const result = await db.query(
            `DELETE FROM villageadvertisement WHERE villageadvertisement_id=$1 RETURNING *`,
            [villageadvertisement_id]
        );
        return result.rows[0];
    } catch (err) {
        console.error("Error in deleteAdvertisement:", err);
        throw err;
    }
};

exports.createUser = async (data) => {


    try {
        for (let key in data) {
            const { villageapp_username, contact, address, isimportant, f_usertype_id, f_user_id, f_elastic_id, f_villageapp_id } = data[key];
            const result = await db.query(
                `INSERT INTO villageapp_user
                (villageapp_username, contact,address, isimportant,f_usertype_id,usertype,
                f_user_id, f_elastic_id, f_villageapp_id)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
                RETURNING *`,
                [
                    villageapp_username,
                    contact,
                    address,
                    isimportant,
                    f_usertype_id.value,
                    f_usertype_id.label,
                    f_user_id,
                    f_elastic_id,
                    f_villageapp_id.value
                ]
            );

        }

        return "Inserted SuccessFully";


    } catch (err) {
        console.error("Error in createUser:", err);
        throw err;
    }







};
// exports.getUsers = async () => {
//     const result = await db.query("SELECT vu.*,v.* FROM villageapp_user vu inner join villageapp v on vu.f_villageapp_id=v.villageapp_id");
//     return result.rows;
// };
exports.getAllUsers = async (payload) => {
    console.log("Payload:", payload);
    const {
        start = 0,
        numberofRows = 10,
        filter = [],
        sort = [],
        appId
    } = payload;

    let query = `SELECT vu.*,v.* FROM villageapp_user vu inner join villageapp v on vu.f_villageapp_id=v.villageapp_id`;
    let countQuery = `SELECT COUNT(*) FROM villageapp_user vu`;
    let values = [];
    let whereConditions = [];

    /*
    FILTERING
    */
    //    whereConditions.push(`vu.f_villageapp_id = $${values.length + 1}`);
    //    values.push(appId);

    filter.forEach((item, index) => {
        const columnName = item.columnName;
        const value = item.value;

        if (typeof value === "string") {
            whereConditions.push(
                `${columnName} ILIKE $${index + 1}`
            );
            values.push(`%${value}%`);
        }
        if (typeof value === "number") {
            whereConditions.push(
                `${columnName} = $${index + 1}`
            );
            values.push(value);
        }

    });



    /*
    WHERE
    */
    console.log("filter Conditions:", filter);
    if (whereConditions.length > 0) {
        const whereClause = ` WHERE ` + whereConditions.join(" AND ");
        query += whereClause;
        countQuery += whereClause;
    }
    console.log(query);
    console.log(values);

    /*
    SORTING
    */
    console.log("whereConditions Conditions:", sort);
    if (sort.length > 0) {
        const sortClause = sort.map(item => `${item.columnName} ${item.sortOrder}`).join(",");
        query += ` ORDER BY ${sortClause}`;
    } else {
        query += ` ORDER BY villageapp_userid DESC`;
    }

    /*
    PAGINATION
    */
    console.log("sort Conditions:", sort);
    query += ` LIMIT $${values.length + 1}`;
    query += ` OFFSET $${values.length + 2}`;

    values.push(numberofRows);
    values.push(start);

    /*
    EXECUTE
    */
    console.log("query Conditions:", query, values);
    const dataResult = await db.query(query, values);

    /*
    COUNT
    */
    console.log("dataResult Conditions:", dataResult);
    const countValues = values.slice(0, values.length - 2);
    const totalResult = await db.query(countQuery, countValues);
    return {
        totalCount: parseInt(totalResult.rows[0].count),
        result: dataResult.rows
    };
};

exports.getUsers = async (payload) => {
    console.log("Payload:", payload);
    const {
        start = 0,
        numberofRows = 10,
        filter = [],
        sort = [],
        appId
    } = payload;

    let query = `SELECT vu.*,v.* FROM villageapp_user vu inner join villageapp v on vu.f_villageapp_id=v.villageapp_id`;
    let countQuery = `SELECT COUNT(*) FROM villageapp_user vu`;
    let values = [];
    let whereConditions = [];

    /*
    FILTERING
    */
    whereConditions.push(`vu.f_villageapp_id = $${values.length + 1}`);
    values.push(appId);

    filter.forEach((item, index) => {
        const columnName = item.columnName;
        const value = item.value;

        if (typeof value === "string") {
            whereConditions.push(
                `${columnName} ILIKE $${index + 1}`
            );
            values.push(`%${value}%`);
        }
        if (typeof value === "number") {
            whereConditions.push(
                `${columnName} = $${index + 1}`
            );
            values.push(value);
        }

    });



    /*
    WHERE
    */
    console.log("filter Conditions:", filter);
    if (whereConditions.length > 0) {
        const whereClause = ` WHERE ` + whereConditions.join(" AND ");
        query += whereClause;
        countQuery += whereClause;
    }
    console.log(query);
    console.log(values);

    /*
    SORTING
    */
    console.log("whereConditions Conditions:", sort);
    if (sort.length > 0) {
        const sortClause = sort.map(item => `${item.columnName} ${item.sortOrder}`).join(",");
        query += ` ORDER BY ${sortClause}`;
    } else {
        query += ` ORDER BY villageapp_userid DESC`;
    }

    /*
    PAGINATION
    */
    console.log("sort Conditions:", sort);
    query += ` LIMIT $${values.length + 1}`;
    query += ` OFFSET $${values.length + 2}`;

    values.push(numberofRows);
    values.push(start);

    /*
    EXECUTE
    */
    console.log("query Conditions:", query, values);
    const dataResult = await db.query(query, values);

    /*
    COUNT
    */
    console.log("dataResult Conditions:", dataResult);
    const countValues = values.slice(0, values.length - 2);
    const totalResult = await db.query(countQuery, countValues);
    return {
        totalCount: parseInt(totalResult.rows[0].count),
        result: dataResult.rows
    };
};


exports.deleteUser = async (data) => {
    const { villageapp_userid } = data;

    try {
        const result = await db.query(
            `DELETE FROM villageapp_user WHERE villageapp_userid = $1 RETURNING *`,
            [villageapp_userid]
        );

        if (result.rowCount === 0) {
            return { message: "User not found" };
        }

        return { message: "User deleted successfully" };
    } catch (err) {
        console.error("Error in deleteUser:", err);
        throw err;
    }
}

exports.updateUser = async (data) => {
    try {

        const { villageapp_userid, villageapp_username, contact, address, isimportant, f_usertype_id, f_user_id, f_elastic_id, f_villageapp_id, priority } = data;
        const result = await db.query(
            `UPDATE villageapp_user SET 
                    villageapp_username=$1,
                    contact=$2,
                    address=$3,
                    isimportant=$4,
                    f_usertype_id=$5,
                    usertype=$6,
                    f_user_id=$7,
                    f_elastic_id=$8,
                    f_villageapp_id=$9,
                    priority=$10
                    WHERE villageapp_userid=$11
                RETURNING *`,
            [
                villageapp_username,
                contact,
                address,
                isimportant,
                f_usertype_id.value,
                f_usertype_id.label,
                f_user_id,
                f_elastic_id,
                f_villageapp_id.value,
                priority,
                villageapp_userid
            ]
        );

        return "Updates SuccessFully";


    } catch (err) {
        console.error("Error in createUser:", err);
        throw err;
    }

};

exports.getImportantPersons = async (payload) => {
    console.log("Payload:", payload);

    // JOIN role r ON vu.f_role_id = r.role_id
    const appId = payload.appId;
    let query = `SELECT vu.villageapp_username, vu.contact, vu.isimportant, vu.priority,vu.usertype
    FROM villageapp_user vu
    WHERE vu.isimportant = true AND vu.f_villageapp_id = $1
    ORDER BY vu.priority ASC LIMIT 4`;

    let values = [appId];

    const dataResult = await db.query(query, values);
    return dataResult.rows
}

exports.analytics = async (payload) => {
    console.log("Payload:", payload);

    // JOIN role r ON vu.f_role_id = r.role_id
    const appId = payload.appId;
    let totalUsersQuery = `SELECT count(*) FROM villageapp_user where f_villageapp_id=$1`;
    let importantUsersQuery = `SELECT count(*) FROM villageapp_user where f_villageapp_id=$1 and isimportant is True`;
    let emergencyOrganisationsQuery = `SELECT count(*) FROM villageorganisation where f_villageapp_id=$1 and isemergency is True`;
    let nonEmergencyOrganisationsQuery = `SELECT count(*) FROM villageorganisation where f_villageapp_id=$1 and isemergency is False`;
    let values = [appId];

    const totalUsersResult = await db.query(totalUsersQuery, values);
    const importantUsersResult = await db.query(importantUsersQuery, values);
    const emergencyOrganisationsResult = await db.query(emergencyOrganisationsQuery, values);
    const nonEmergencyOrganisationsResult = await db.query(nonEmergencyOrganisationsQuery, values);


    return [
        {
            lbl: "+ Residents", count: parseInt(totalUsersResult.rows[0].count)
        },
        {
            lbl: "Associates", count: parseInt(importantUsersResult.rows[0].count)
        },
        {
            lbl: "Emergency Service", count: parseInt(emergencyOrganisationsResult.rows[0].count)
        },
        {
            lbl: "Organisations", count: parseInt(nonEmergencyOrganisationsResult.rows[0].count)
        }
    ]

}

exports.addProduct = async (data) => {
    const {
        category_id,
        category_name,
        product_name,
        product_desc,
        price,
        location,
        type,
        registered_userid,
        product_images
    } = data;

    const client = await db.connect();

    try {
        await client.query("BEGIN");
        console.log("Adding product with data:BEGIN");
        // 1. Insert the product
        const productResult = await client.query(
            `INSERT INTO village_market
            (
                category_id,
                category_name,
                product_name,
                product_desc,
                images,
                price,
                location,
                type,
                registered_userid
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`,
            [
                category_id,
                category_name,
                product_name,
                product_desc,
                [], // images will be updated after image inserts
                price,
                location,
                type,
                registered_userid
            ]
        );
        console.log("Adding product with data:INSERT", productResult);
        const product = productResult.rows[0];

        // 2. Insert uploaded images
        const imageIds = [];

        for (const imageUrl of product_images || []) {

            const imageResult = await client.query(
                `INSERT INTO village_market_images
                (market_image,market_id)
                VALUES ($1,$2)
                RETURNING market_image_id`,
                [imageUrl, product.market_id]
            );

            imageIds.push(imageResult.rows[0].market_image_id);
        }
        console.log("Adding product with data:INSERT2");
        // 3. Store image IDs in village_market.images
        const updatedProduct = await client.query(
            `UPDATE village_market
             SET images = $1
             WHERE market_id = $2
             RETURNING *`,
            [imageIds, product.market_id]
        );

        await client.query("COMMIT");
        console.log("Adding product with data:INSERT3");
        return "Inserted Successfully";

    } catch (error) {

        await client.query("ROLLBACK");
        throw error;

    } finally {
        client.release();
    }
};




// exports.listProducts = async () => {
//     const result = await db.query(`SELECT * FROM village_market`);
//     return result.rows;
// };

exports.listProducts = async (payload) => {

    const {
        start = 0,
        numberofRows = 10,
        filter = [],
        sort = []
    } = payload;

    let query = `SELECT * FROM village_market`;
    let countQuery = `SELECT COUNT(*) FROM village_market`;
    let values = [];
    let whereConditions = [];

    /*
    FILTERING SELECT vm.*,vmi.market_image FROM village_market vm LEFT JOIN village_market_images vmi ON vm.market_id=vmi.market_id
    */

    filter.forEach((item, index) => {
        const columnName = item.columnName;
        const value = item.value;
        whereConditions.push(`${columnName} ILIKE $${index + 1}`);
        values.push(`%${value}%`);

    });

    /*
    WHERE
    */

    if (whereConditions.length > 0) {
        const whereClause = ` WHERE ` + whereConditions.join(" AND ");
        query += whereClause;
        countQuery += whereClause;
    }

    /*
    SORTING
    */

    if (sort.length > 0) {
        const sortClause = sort.map(item => `${item.columnName} ${item.sortOrder}`).join(",");
        query += ` ORDER BY ${sortClause}`;
    } else {
        query += ` ORDER BY market_id DESC`;
    }

    /*
    PAGINATION
    */

    query += ` LIMIT $${values.length + 1}`;
    query += ` OFFSET $${values.length + 2}`;

    values.push(numberofRows);
    values.push(start);

    /*
    EXECUTE
    */
    console.log("query Conditions:", query, values);
    const dataResult = await db.query(query, values);

    /*
    COUNT
    */

    const countValues = values.slice(0, values.length - 2);
    const totalResult = await db.query(countQuery, countValues);
    return {
        totalCount: parseInt(totalResult.rows[0].count),
        result: dataResult.rows
    };
};

exports.updateProduct = async (data) => {
    const {
        id,
        category_id,
        category_name,
        product_name,
        product_desc,
        price,
        location,
        type,
        registered_userid,
        product_images
    } = data;

    const client = await db.connect();

    try {
        await client.query("BEGIN");
        console.log("Updating product with data:BEGIN");

        // 1. Update the product fields
        await client.query(
            `UPDATE village_market SET
                category_id=$1,
                category_name=$2,
                product_name=$3,
                product_desc=$4,
                price=$5,
                location=$6,
                type=$7,
                registered_userid=$8
                WHERE market_id=$9`,
            [
                category_id,
                category_name,
                product_name,
                product_desc,
                price,
                location,
                type,
                registered_userid,
                id
            ]
        );

        // 2. If new images are provided, delete old images and insert new ones
        if (product_images && product_images.length > 0) {
            // Delete old images
            await client.query(
                `DELETE FROM village_market_images WHERE market_id=$1`,
                [id]
            );

            // Insert new images
            const imageIds = [];
            for (const imageUrl of product_images) {
                const imageResult = await client.query(
                    `INSERT INTO village_market_images
                    (market_image, market_id)
                    VALUES ($1, $2)
                    RETURNING market_image_id`,
                    [imageUrl, id]
                );
                imageIds.push(imageResult.rows[0].market_image_id);
            }

            // Update image IDs in village_market.images
            await client.query(
                `UPDATE village_market
                 SET images = $1
                 WHERE market_id = $2`,
                [imageIds, id]
            );
        }

        await client.query("COMMIT");
        console.log("Updating product with data:COMMIT");
        return "Updated Successfully";

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

exports.deleteProduct = async (data) => {
    const { id } = data;

    try {
        const result = await db.query(
            `DELETE FROM village_market WHERE market_id=$1 RETURNING *`,
            [id]
        );
        return result.rows[0];
    } catch (err) {
        throw new Error(err.message);
    }
};

exports.get_product_images = async (data) => {
    const { image_id } = data;

    try {
        const result = await db.query(
            `SELECT * FROM village_market_images where market_image_id = $1 `,
            [image_id]
        );
        return result.rows[0];
    } catch (err) {
        throw new Error(err.message);
    }
};