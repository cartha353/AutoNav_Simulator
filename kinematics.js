///<reference path=".\TSDef\p5.global-mode.d.ts" />

let K1 = 1.0;
let K2 = 3.0;

function limitRadians(low, high, r)
{
  let result = r;
  
  while(result > high)
  {
    result = result - (2 * PI);
  }

  while(result < low)
  {
    result = result + (2 * PI);
  }

  return result;
}

function calculateNewPosition(oldPosture, vL, vR, dt, wheelDiameter, baseWidth)
{
  let newPosture = new Array(3);
  let oldHeadingRadians = oldPosture[2];

  let deltaLeft = wheelDiameter * vL * dt;
  let deltaRight = wheelDiameter * vR * dt;

  //Use encoders to calculate heading
  let deltaPsi = (deltaRight - deltaLeft) / baseWidth; //this is the width from center left wheel to center right wheel

  //Calcualte new X, Y
  let deltaX = ((deltaLeft + deltaRight)/2) * Math.cos(oldHeadingRadians);    //previous heading is in radians
  let deltaY = ((deltaLeft + deltaRight)/2) * Math.sin(oldHeadingRadians);    //previous heading is in radians
  
  newPosture[0] = oldPosture[0] + deltaX;
  newPosture[1] = oldPosture[1] + deltaY;
  newPosture[2] = limitRadians(-PI, PI, (oldPosture[2] + deltaPsi));

  return newPosture;
}

function calculateTurnRate(currentPose,  targetPose, currentVelocity)
{
  let result = NaN;
  let vv = currentVelocity;
  let poseHeading = currentPose[2];

  //Check if direction of velocity is in reverse
  if (currentVelocity < 0) 
  {
    //Since current velocity is negative, we must flip the sign to be positive for the algorithm to work!
    vv = -currentVelocity; 
    //Set the pose to be 180 from "front" to show backwards direction
    poseHeading = poseHeading + Math.PI;
  }

  //Limit pose heading to be within -Pi and Pi
  poseHeading = limitRadians(-PI, PI, poseHeading ); // poseHeading is now radians

  // With the velocity and robot heading set appropriately, get the range
  // and the vector orientation that runs from the robot to the target
  let dx = targetPose[0] - currentPose[0];
  let dy = targetPose[1] - currentPose[1];

  //Calculate and set range
  let m_range = calculateRange(currentPose, targetPose); // distance in feet
  let r_angle = Math.atan2( dy, dx );    // vector heading in radians

  // Compute the angle between this vector and the desired orientation at the target
  let thetaT = targetPose[2] - r_angle;
  thetaT = limitRadians(-PI, PI, thetaT); // bound this between -PI to PI

  // Compute the angle between current robot heading and the vector from
  // the robot to the target
  let del_r = poseHeading - r_angle;
  del_r = limitRadians(-PI, PI, del_r); // bound this between -PI to PI
  
  // All set, now the equation for the angular rate!
  result = -(vv / m_range) * (K2 * ( del_r - Math.atan( -K1 * thetaT ) ) + 
    Math.sin( del_r ) * ( 1.0 + ( K1 / ( 1.0 + (K1 * thetaT)*(K1 * thetaT)))));
    
  return result;
}

function calculateRange(currentPose, targetPose)
{
  let dx = targetPose[0] - currentPose[0];
  let dy = targetPose[1] - currentPose[1];
  return Math.sqrt( dx * dx + dy * dy );
}