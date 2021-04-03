///<reference path=".\TSDef\p5.global-mode.d.ts" />

var NOT_SELECTED = 0;
var VELOCITY_SELECTED = 1;
var TRIANGLE_SELECTED = 2;

class Pose
{
	constructor(x, y, headingRadians, velocity)
	{
		

		this.triangleBase = 2.0; //In feet
		this.triangleHeight = 2.0; //In feet
		this.velocityBase = 0.5;  //In Feet 
		this.velocityHeight = 1.0; //Will change with speed
		this.sourceTrianglePoints = new Array(3);
		this.trianglePoints = new Array(3);
		this.sourceVelocityPoints = new Array(4);
		this.velocityPoints = new Array(4);
		this.velocityBrightness = 255;
		this.triangleBrightness = 255;

		//Save info for printout
		this.position = createVector(x, y);
		this.headingRadians = headingRadians;
		this.velocity = velocity;
		
		//Create Triangle
		this.sourceTrianglePoints[0] = [this.triangleHeight/2, 0, 1];
		this.sourceTrianglePoints[1] = [-this.triangleHeight/2, this.triangleBase/2, 1];
		this.sourceTrianglePoints[2] = [-this.triangleHeight/2, -this.triangleBase/2, 1];

		//Create Velocity
		this.sourceVelocityPoints[0] = [this.triangleHeight/2, this.velocityBase/2, 1];
		this.sourceVelocityPoints[1] = [this.triangleHeight/2, -this.velocityBase/2 , 1];
		this.sourceVelocityPoints[2] = [this.triangleHeight/2 + this.velocityHeight, -this.velocityBase/2, 1];
		this.sourceVelocityPoints[3] = [this.triangleHeight/2 + this.velocityHeight, this.velocityBase/2, 1];

		this.movePose(this.position.x, this.position.y, this.headingRadians, this.velocity);
	}

	movePose(tX, tY, headingRadians, velocity)
	{
		let motionMat = new Array(3);

		motionMat[0] = [ Math.cos(headingRadians),  Math.sin(headingRadians), 0];
		motionMat[1] = [-Math.sin(headingRadians),  Math.cos(headingRadians), 0];
		motionMat[2] = [ 	 										tX, 					 			 			 tY, 1];

		//Move and rotate triangle
		for(let i = 0; i < this.trianglePoints.length; i++)
		{
			let tempA = [this.sourceTrianglePoints[i]];
			this.trianglePoints[i] = mat_mul(tempA, motionMat)[0];
		}

		//Move and rotate velocity rectangle
		let tempVelA = [];
		tempVelA[0] = [this.sourceVelocityPoints[0]];
		tempVelA[1] = [this.sourceVelocityPoints[1]];
		tempVelA[2] = [[this.triangleHeight/2 + (this.velocityHeight * this.velocity), -this.velocityBase/2, 1]];
		tempVelA[3] = [[this.triangleHeight/2 + (this.velocityHeight * this.velocity), this.velocityBase/2, 1]];
		
		for(let i = 0; i < this.velocityPoints.length; i++)
		{
			this.velocityPoints[i] = mat_mul(tempVelA[i], motionMat)[0];
		}

		//Save info
		this.position = createVector(tX, tY);
		this.headingRadians = headingRadians;
		this.velocity = velocity;
	}

	rollover(x, y)
	{
		let selectedState = NOT_SELECTED;

		if(collidePointPoly(x, y, 
												[createVector(this.trianglePoints[0][0], this.trianglePoints[0][1]),
												createVector(this.trianglePoints[1][0], this.trianglePoints[1][1]),
												createVector(this.trianglePoints[2][0], this.trianglePoints[2][1])]))
		{
			this.triangleBrightness = 100;
			selectedState = TRIANGLE_SELECTED;
		}
		else
		{
			this.triangleBrightness = 255;
		}

		if(collidePointPoly(x, y, 
			[createVector(this.velocityPoints[0][0], this.velocityPoints[0][1]),
			 createVector(this.velocityPoints[1][0], this.velocityPoints[1][1]),
			 createVector(this.velocityPoints[2][0], this.velocityPoints[2][1]),
			 createVector(this.velocityPoints[3][0], this.velocityPoints[3][1])]))
		{
			this.velocityBrightness = 100;
			selectedState = VELOCITY_SELECTED;
		}
		else
		{
			this.velocityBrightness = 255;
		}

		return selectedState;
	}
}