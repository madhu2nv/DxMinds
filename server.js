const express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
const http = require('http');
var mongojs = require('mongojs');
const app = express();
var paginate = require('jw-paginate')
const { body, validationResult } = require('express-validator');
const port = 3000;
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
var db = require('./database').url; //To connection to database, seperate js file is used

app.post('/loginDetails',
    body('Name')
        .isLength({ min: 3 }).withMessage('Name must be of 3 characters long.')
        .matches(/^[A-Za-z\s]+$/).withMessage('Name must be alphabetic.'),
    body('email').isEmail(),
    body('MobNumber').isLength({ min: 10 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        pNumPresent = await chechPnumer(req.body.MobNumber)
        emailPresent = await checkEmail(req.body.email)
        if ((pNumPresent == 1) && (emailPresent == 1)) {
            res.json("Phone number and Email already exists")
        }
        else if ((pNumPresent == 1) && (emailPresent == 0)) {
            res.json("Phone number already exists")

        }
        else if ((pNumPresent == 0) && (emailPresent == 1)) {
            res.json("Phone Email already exists")

        } else {
            db.loginDetails.insert({ "Name": req.body.Name, "Mobile_Number": req.body.MobNumber, "Email": req.body.email }, (err, doc) => {
                res.json(doc)
            })
        }
    })


function chechPnumer(pnum) {
    return new Promise((resolve, reject) => {
        db.loginDetails.find({ "Mobile_Number": Number(pnum) }, (err, doc) => {
            if (!(doc.length == 0)) {
                var pDetails = doc.length
                resolve(pDetails)
            } else {
                var pDetails = doc.length
                resolve(pDetails)
            }
        })
    })
}

function checkEmail(email) {
    return new Promise((resolve, reject) => {
        db.loginDetails.find({ "Email": email }, (err, doc) => {
            if (!(doc.length == 0)) {
                var pDetails = doc.length
                resolve(pDetails)
            } else {
                var pDetails = doc.length
                resolve(pDetails)
            }
        })
    })
}

app.get('/tableData:num', (req, res) => {
    db.loginDetails.find({}, (err, doc) => {
        const page = parseInt(req.params.num) || 1;
        const pageSize = 6;
        const pager = paginate(doc.length, page, pageSize);
        const pageOfItems = doc.slice(pager.startIndex, pager.endIndex + 1);
        return res.json({ pager, pageOfItems });
    })
})

app.put('/updateEmpDetails',
    body('editFormData.Name')
        .isLength({ min: 3 }).withMessage('Name must be of 3 characters long.')
        .matches(/^[A-Za-z\s]+$/).withMessage('Name must be alphabetic.'),
    body('editFormData.email').isEmail(),
    body('editFormData.MobNumber').isLength({ min: 10 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        pNumPresent = await chechPnumer(req.body.editFormData.MobNumber)
        emailPresent = await checkEmail(req.body.editFormData.email)

        if ((pNumPresent == 1) && (emailPresent == 1)) {
            res.json("Phone number and Email already exists")
        }
        else if ((pNumPresent == 1) && (emailPresent == 0)) {
            res.json("Phone number already exists")

        }
        else if ((pNumPresent == 0) && (emailPresent == 1)) {
            res.json("Phone Email already exists")

        } else {
            db.loginDetails.update({ "_id": mongojs.ObjectId(req.body.id) },
                {
                    $set: {
                        "Name": req.body.editFormData.Name, "Mobile_Number": req.body.editFormData.MobNumber,
                        "Email": req.body.editFormData.email
                    }
                }, (err, doc) => {

                    res.json(doc)
                })
        }

    })

app.delete('/deleteEmpDetails:id', (req, res) => {
    db.loginDetails.remove({ "_id": mongojs.ObjectId(req.params.id) }, (err, doc) => {
        res.json(doc)
    })
})

app.get('/filterByEmpDetails/:option/:empField', (req, res) => {
    console.log(req.params.option)
    console.log(req.params.empField)
    if (req.params.option == "mobile_Num") {
        db.loginDetails.find({ "Mobile_Number": Number(req.params.empField) }, (err, doc) => {
            res.json(doc)
        })

    } else if (req.params.option == "Email") {
        db.loginDetails.find({ "Email": req.params.empField }, (err, doc) => {
            res.json(doc)
        })

    } else if (req.params.option == "Name") {
        db.loginDetails.find({ "Name": req.params.empField }, (err, doc) => {
            res.json(doc)
        })
    }
    else {
        db.loginDetails.find({}, (err, doc) => {
            res.json(doc)
        })
    }
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))