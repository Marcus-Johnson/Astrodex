const scenarios = require('../data/scenarios');
const { validateSimulation } = require('../validation/simulation.validation');

const simulateRocket = (req, res) => {
  const { error } = validateSimulation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  const scenarioName = scenario.name;

  console.log(`Scenario: ${scenarioName} - Starting simulation`);

  const initialState = {
    fuelRemaining: req.body.rocket_specifications.fuel_capacity,
    altitude: 0,
    velocity: req.body.trajectory_information.initial_velocity,
    stage: 1,
    time: 0,
    complete: false,
    distanceTraveled: 0,
    payloadStatus: 'Nominal',
  };

  const interval = setInterval(() => {
    const logData = simulateStep(req.body, initialState);
    console.log(logData);
    if (logData.complete) {
      clearInterval(interval);
      const result = scenario.execute(req.body);
      res.json({
        message: 'Simulation complete',
        scenario: scenarioName,
        result,
      });
    }
  }, 1000);
};

const simulateStep = (data, state) => {
  const {
    rocket_specifications,
    environmental_factors,
    trajectory_information,
    fuel_and_propulsion_details,
  } = data;

  const fuelConsumptionRate = rocket_specifications.engine_thrust * 0.001; 
  const gravity = environmental_factors.gravity;
  const burnTimePerStage = fuel_and_propulsion_details.burn_time_per_stage[state.stage - 1] || 0;

  if (state.fuelRemaining <= 0 || state.altitude < 0) {
    state.complete = true;
    return {
      ...state,
      step: 'Simulation ended due to lack of fuel or negative altitude',
    };
  }

  if (state.time >= burnTimePerStage) {
    state.stage += 1;
    if (state.stage > rocket_specifications.number_of_stages) {
      state.complete = true;
      return {
        ...state,
        step: 'Simulation ended after all stages completed',
      };
    }
    console.log(`Stage ${state.stage - 1} complete. Starting Stage ${state.stage}...`);
  }

  state.time += 1;
  state.fuelRemaining -= fuelConsumptionRate;
  state.velocity += (rocket_specifications.engine_thrust / (rocket_specifications.weight + data.payload_details.payload_weight)) * rocket_specifications.fuel_efficiency - gravity;
  state.altitude += state.velocity;
  state.distanceTraveled += state.velocity;

  if (state.time % 10 === 0) {
    state.payloadStatus = Math.random() > 0.95 ? 'Malfunction' : 'Nominal';
  }

  return {
    ...state,
    step: `Time: ${state.time}s, Altitude: ${state.altitude.toFixed(2)}m, Velocity: ${state.velocity.toFixed(2)}m/s, Distance Traveled: ${state.distanceTraveled.toFixed(2)}m, Fuel Remaining: ${state.fuelRemaining.toFixed(2)}L, Payload Status: ${state.payloadStatus}`,
  };
};

module.exports = { simulateRocket };