const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const Users = mongoose.model('Users');
const { expressjwt: jwt } = require('express-jwt');

const getTokenFromHeaders = (req) => {
    const { headers: { authorization } } = req;

    if(authorization && authorization.split(' ')[0] === 'Token') {
        return authorization.split(' ')[1];
    }
    return null;
};

const auth = {
    required: jwt({
        secret: 'secret',
        algorithms: ["HS256"],
        // userProperty: 'payload',
        // getToken: getTokenFromHeaders,
    }),
    optional: jwt({
        secret: 'secret',
        algorithms: ["HS256"],
        // userProperty: 'payload',
        // getToken: getTokenFromHeaders,
        credentialsRequired: false,
    }),
};

//POST new user route (optional, everyone has access)
router.post('/', auth.optional, async (req, res, next) => {
    const { body: { user } } = req;

    if(!user.email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
    }

    if(!user.password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
    }

    let query = {email: user.email};
    const existUser  = await Users.findOne(query);

    if (existUser) {
        return res.status(409).json({
            errors: {
                email: '"Account already exists"',
            },
        });
    }

    const finalUser = new Users(user);

    finalUser.setPassword(user.password);

    return finalUser.save()
        .then(() => res.json({ user: finalUser.toAuthJSON() }));
});

router.patch("/", auth.required, async (req, res) => {
    console.log(req.body.password);
    const query = { _id: req.auth.id ? req.auth.id : "" };
    if (req.body.password) {
        const updates = {
            password: req.body.password
        };

        try {
            // const updatedUser = await Users.findById(req.auth.id);
            // updatedUser.setPassword(user.password);
            // return updatedUser.save()
            //     .then(() => res.json({ message: `User's password was successfully updated. }` }));

            await Users.findById(req.auth._id, (err, user)=> {
                if (err) {
                    console.log(err);
                } else {
                    console.log(user);
                    user.setPassword(req.body.password,(err, user)=>{
                        if (err) {
                            console.log('set pass error'+err);
                        } else {
                            user.save();
                            console.log('new pass set successfully!!');
                            res.status(200).json({ message: `User password was successfully updated`});
                        }
                    });
                }
            });

        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    } else {
        const updates = {
            email: req.body.email
        };

        try {
            await Users.updateOne(query, updates);
            const updatedUser = await Users.findById(req.auth.id);
            res.status(200).json({ message: `User was successfully updated. New Email: ${updatedUser.email}` });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

});

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
    const { body: { user } } = req;
    if(!user.email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
    }

    if(!user.password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
    }

    return passport.authenticate('login', { session: false }, (err, passportUser, info) => {
        if(err) {
            return next(err);
        }

        if(passportUser) {
            const user = passportUser;
            user.token = passportUser.generateJWT();

            return res.json({ user: user.toAuthJSON() });
        }

        return res.status(400).json({ errors: { info } });
    })(req, res, next);
});

router.get('/profile', auth.required, async (req, res, next) => {
    const query = { _id: req.auth.id ? req.auth.id : "" };
    try {
        const user = await Users.findById(req.auth.id);
        res.status(200).json({
            "email": user.email,
            "avatar": user.avatar
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

});

//GET Test (required, only authenticated users have access)
router.get('/test', auth.required, (req, res, next) => {
    return res.json({message: "Welcome"})
});


module.exports = router;