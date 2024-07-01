const Joi = require('joi');

const validateSimulation = (data) => {
  const schema = Joi.object({
    rocket_specifications: Joi.object({
      weight: Joi.number().required(),
      height: Joi.number().required(),
      diameter: Joi.number().required(),
      fuel_capacity: Joi.number().required(),
      engine_thrust: Joi.number().required(),
      fuel_efficiency: Joi.number().required(),
      number_of_stages: Joi.number().required(),
      payload_capacity: Joi.number().required(),
    }).required(),
    mission_parameters: Joi.object({
      destination: Joi.string().required(),
      launch_site: Joi.object({
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
      }).required(),
      launch_angle: Joi.number().required(),
      launch_date: Joi.date().required(),
    }).required(),
    environmental_factors: Joi.object({
      atmospheric_conditions: Joi.object({
        pressure: Joi.number().required(),
        temperature: Joi.number().required(),
      }).required(),
      wind_speed: Joi.number().required(),
      gravity: Joi.number().required(),
    }).required(),
    payload_details: Joi.object({
      payload_weight: Joi.number().required(),
      payload_type: Joi.string().required(),
      payload_dimensions: Joi.object({
        length: Joi.number().required(),
        width: Joi.number().required(),
        height: Joi.number().required(),
      }).required(),
    }).required(),
    trajectory_information: Joi.object({
      initial_velocity: Joi.number().required(),
      target_orbit_altitude: Joi.number().required(),
      transfer_orbit: Joi.object({
        apoapsis: Joi.number().required(),
        periapsis: Joi.number().required(),
      }).required(),
      flight_path_angle: Joi.number().required(),
    }).required(),
    fuel_and_propulsion_details: Joi.object({
      fuel_type: Joi.string().required(),
      oxidizer_type: Joi.string().required(),
      burn_time_per_stage: Joi.array().items(Joi.number()).required(),
    }).required(),
    additional_parameters: Joi.object({
      communication_range: Joi.number().required(),
      navigation_system: Joi.string().required(),
      thermal_protection: Joi.string().required(),
    }).required(),
  });

  return schema.validate(data);
};

module.exports = { validateSimulation };