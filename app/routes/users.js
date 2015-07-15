var express = require('express');
var router = express.Router();
var Datastore = require('nedb');
var db = new Datastore({ filename: __approot + '/data/usersdb.json', autoload: true });
var passwordHash = require('password-hash');
var generatePassword = require('password-generator');

// Using a sparse unique index
db.ensureIndex({ fieldName: 'phone', unique: true, sparse: true }, function (err) {});


function TryCount(req) {

    if(req.session.try){
        req.session.try++;
        if(req.session.try > 10)
            return false;
    } else {
        req.session.try =1;
    }

    return true;
}

router.get('/register', function(req, res, next) {
    if (req.isAuthenticated()) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    } else {
        if(TryCount(req)){
            res.render('users/register', {'title': "Регистрация"});
        } else {
            res.render('ban', {'try_name': "зарегистрироваться"});
        }
    }
});

router.post('/register', function(req, res, next){
    //res.json(req.body.phone);
    if(TryCount(req)){
        var pass = generatePassword(6, false);
        db.insert({phone: req.body.phone, password: pass, pay: null}, function (err, newDoc) {
            if (err) {
                req.add_flash('danger', 'К сожалению, пользователь с таким номером уже зарегистрирован.');
                res.redirect('/user/register');
            } else {
                res.json(newDoc);
            }

        });
    } else {
        res.render('ban', {'try_name': "зарегистрироваться"});
    }
});

router.get('/login', function(req, res, next) {
    if (req.isAuthenticated()) {
        req.add_flash('success', 'Вы уже авторизованы.' );
        res.redirect('/');
    } else {

        db.findOne({ phone:"+79313917415"}, function (err, docs) {
            var hashedPassword = passwordHash.generate(docs.password);
            //res.json(passwordHash.verify(docs.password, hashedPassword));
        });

        var pass = generatePassword(6, false) // -> 76PAGEaq6i5c

        res.json(pass);

        //res.render('users/login', {'title': "Авторизация"})
    }
});

router.post('/login', function(req, res, next) {

    db.findOne({ phone: req.body.phone }, function (err, docs) {
        var hashedPassword = passwordHash.generate(docs.password);

        res.json(docs);
    });

});


/* GET users listing. */
router.get('/pricing', function(req, res, next) {
  res.render('users/pricing', {title: 'Pricing Page'});
});

router.get('/setting', function(req, res, next) {
    res.render('users/setting', {'title': "Setting Page"})
});


router.get('/logout', function(req, res, next) {
    // clear user session
    req.session.loggedIn = false;
    req.add_flash('info', 'До скорой встречи!' );
    res.redirect('/');
});

module.exports = router;
