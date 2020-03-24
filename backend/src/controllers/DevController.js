const axios = require ('axios');
const Dev = require ('../models/Dev');
const parseStringAsArrays = require ('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require ('../websocket');

//index, show, store, update, destroy
module.exports = {
  async index(request, response) {
    const devs = await Dev.find();

    return response.json(devs);
  },

  async store (request, response) {
    const { github_username, techs, latitude, longitude } = request.body;
    //evitar cadastro duplicado
    let dev = await Dev.findOne({ github_username});

    if (!dev) {
      const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    
      const { name = login, avatar_url, bio } = (apiResponse.data);
    
      const techsArray = parseStringAsArrays(techs);
    
      const location = { 
        type: 'Point',
        coordinates: [longitude, latitude],
      };
    
       dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location,
      })

      //Filtrar as conexões que estão há no máximo 10km de distância
      // e que o novo dev tenha pelo menos uma das techs filtradas
      
      const sendSocketMessageTo = findConnections(
        { latitude, longitude},
        techsArray,
      )

      sendMessage(sendSocketMessageTo, 'new-dev', dev);
    }

    return response.json(dev);
  },

  // async update (request, response){
  //   const { name = login, avatar_url,  bio, techs, location} = request.body;

  //   const dev = await Dev.findByIdAndUpdate(request.params.id, request.body, { 
  //     new: true
  //   });

  //   console.log(name, avatar_url, bio, techs, location, github_username);

  //   return response.json(dev);
  // },

  // async destroy (request, response) {

  // }
}
