const Dev = require ('../models/Dev');
const parseStringAsArrays = require ('../utils/parseStringAsArray');

module.exports = {
  async index(request, response) {
    const { latitude, longitude, techs } = request.query;

    const techsArrays = parseStringAsArrays(techs);

    const devs = await Dev.find({
      techs: {
        $in:  techsArrays,
      },
      location: {
        $near: {
          $geometry: {
            type:'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: 10000,
        },
      },
    });
    // buscar todos os devs num raio  10km
    // filtrar por technologias
    return response.json({devs});

  }
}