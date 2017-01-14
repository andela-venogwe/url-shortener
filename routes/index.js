var express = require('express');
var router = express.Router();
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./storage');
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const shorten = () => {
  return Math.floor(Math.random() * 10000) + 1000;
};

const validateUrl = (url) => {
  // Checks to see if it is an actual url
  // Regex from https://gist.github.com/dperini/729294
  const regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  return regex.test(url);
};

router.get('/new/:url*', (req, res, next) => {
  const link = req.originalUrl.slice(5);
  if (validateUrl(link)) {
    const resObject = {};
    const short = shorten();
    const fullUrl = 
    `${req.protocol}://${req.get('host')}/${short}`;
    localStorage.setItem(short, link);
    resObject.original_url =  link;
    resObject.short_url = fullUrl;
    res.send(resObject);
  } else { res.send({ message: `bad url format supplied` }) }
});

router.get('/:url', (req, res, next) => {
  const input = req.params.url;
  if(/\d{4}/g.test(input) && input > 1000 && input < 10000){
    const exists = localStorage.getItem(input);
    const fullUrl = 
    `${req.protocol}://${req.get('host')}/${input}`;
    exists ? res.redirect(exists) : 
    (
      res.send(
        { message: `This shortlink url (${fullUrl}) does not exist.` }
      )
    );
  } else { 
    res.send({ message: 'invalid shortlink suplied' })
  }
});

module.exports = router;
