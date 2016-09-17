//Watson test
var watson = require('watson-developer-cloud');
var watsonKeys = require('../db/watson/keys.js');
var request = require('request');
var fs = require('fs');
var path = require('path');

var runVisualRecognition = function(url, callback) {

  var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
  var visual_recognition = new VisualRecognitionV3({
    api_key: watsonKeys.visualKey['api_key'],
    version_date: '2016-05-19'
  });
  var write = fs.createWriteStream(path.join(__dirname, 'grabimage.png'));

  // var file = ''
  console.log('url==', url)
  // request
  // write.on('finish', function(){
    console.log('omg in write finish')
    // request(url).pipe(write)

    var stream = request(url).pipe(write)

    stream.on('finish', function(){
      console.log('FINISHED-------------------------------')

          var file = path.join(__dirname, 'grabimage.png')

        // console.log('=========================',path.join(__dirname, './meprofile.png'))
        var params = {
          // request(url).pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + url));
          images_file: fs.createReadStream(file)
          // images_file: fs.createReadStream(path.join(__dirname, '/../server/images/dog.png'))
        };
        console.log('params', params)


        visual_recognition.classify(params, function(err, res) {
          if (err) {
            console.log(err);
          }
          else{
            console.log('===============', JSON.stringify(res, null, 2));
            callback(res);

          }
        });
    })
      
    // })


  // })
  // console.log('IN WATSON FILE:', path.join(__dirname, 'grabimage'))
  

  // request('http://fromrussiawithlove.com/baby.mp3').pipe(fs.createWriteStream('song.mp3'))



}

var runLanguageProcessig = function(text, callback) {

  var AlchemyLanguageV1 = require('watson-developer-cloud/alchemy-language/v1');

  var alchemy_language = new AlchemyLanguageV1({
    api_key: watsonKeys.languageKey['api_key']
  });

  var params = {
    text: text
    // text: 'IBM Watson won the Jeopardy television show hosted by Alex Trebek'
  };

  alchemy_language.sentiment(params, function (err, response) {
    if (err)
      console.log('error:', err);
    else
      callback(response)
      console.log('==========', JSON.stringify(response, null, 2));
  });

}

  // curl -X POST -F "image_file=@red_dress.jpg" "https://gateway-a.watsonplatform.net/visual-recognition/api/v3/collections/{collection_id}/find_similar?limit=100&api_key={api-key}&version=2016-05-20"
var runPersonalityInsight = function(text, callback) {
  var PersonalityInsightsV2 = require('watson-developer-cloud/personality-insights/v2');

  var personality_insights = new PersonalityInsightsV2({
    username: watsonKeys.personalityKey['username'],
    password: watsonKeys.personalityKey['password']
  });

  personality_insights.profile({
    text: text,
    // text: 'i am so great. I love cats and coding. javscript is the best. people are so cool. why don\'t I have more money. i am getting fat. waaaaah. i am thinking about eating good food. ramen. noodles. i am so great. I love cats and coding. javscript is the best. people are so cool. why don\'t I have more money. i am getting fat. waaaaah. i am thinking about eating good food. ramen. noodles. i am so great. I love cats and coding. javscript is the best. people are so cool. why don\'t I have more money. i am getting fat. waaaaah. i am thinking about eating good food. ramen. noodles. i am so great. I love cats and coding. javscript is the best. people are so cool. why don\'t I have more money. i am getting fat. waaaaah. i am thinking about eating good food. ramen. noodles. i am so great. I love cats and coding. javscript is the best. people are so cool. why don\'t I have more money. i am getting fat. waaaaah. i am thinking about eating good food. ramen. noodles. i am so great. I love cats and coding. javscript is the best. people are so cool. why don\'t I have more money. i am getting fat. waaaaah. i am thinking about eating good food. ramen. noodles. i am so great. I love cats and coding. javscript is the best. people are so cool. why don\'t I have more money. i am getting fat. waaaaah. i am thinking about eating good food. ramen. noodles. i am so great. I love cats and coding. javscript is the best. people are so cool. why don\'t I have more money. i am getting fat. waaaaah. i am thinking about eating good food. ramen. noodles. i am so great. I love cats and coding. javscript is the best. people are so cool. why don\'t I have more money. i am getting fat. waaaaah. i am thinking about eating good food. ramen. noodles. i am so great. I love cats and coding. javscript is the best. people are so cool. why don\'t I have more money. i am getting fat. waaaaah. i am thinking about eating good food. ramen. noodles. ',
    // text: 'Learn how to think like a software engineer You can get a great start to learning code by using online resources, but there is a lot more to working in software engineering than writing code. At Hack Reactor’s software career accelerator, you will also learn CS fundamentals and engineering best practices.Our Goal: You’ll begin Hack Reactor with a feeling of excitement and anticipation. Twelve weeks later, you’ll follow the footsteps of our trailblazing alumni, taking the methodologies and best practices you perfected at our coding bootcamp to your next job. We’ve built world class software engineering curriculum and programming courses. However, Hack Reactor is, above all else, a world-class learning environment.',
    language: 'en' },
    function (err, response) {
      console.log('OMG GOT RESPONSE FROM WATSON', response)
      if (err)
        console.log('error:', err);
      else {
        callback(response);
        // var categories = response.tree.children.map(cat=>{cat});
        // var personality = categories[0].children.map(personality=>{return {main:personality.name, sub: personality.children.map(child=>child.name)}});
        // var needs = categories[1].children.map(personality=>{return {main:personality.name, sub: personality.children.map(child=>child.name)}});
        // var values = categories[2].children.map(personality=>{return {main:personality.name, sub: personality.children.map(child=>child.name)}});
        // console.log('1', personality, '2', needs,'3', values)
      }
  });
}

module.exports = {
  runPersonalityInsight: runPersonalityInsight,
  runLanguageProcessig: runLanguageProcessig,
  runVisualRecognition: runVisualRecognition
};
