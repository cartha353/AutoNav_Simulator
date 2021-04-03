///<reference path=".\TSDef\p5.global-mode.d.ts" />

class Pose
{
	constructor(x, y, headingRadians, velocity)
	{
		this.triangleWidth = 20;
		this.triangleHeight = 40;
        this.trianglePoints = new Array(3);
        this.velocityPoints = new Array(4);
		this.arrowBrightness = 0;
		this.triangleBrightness = 0;
		this.position = createVector(x,y);
	}

    trianglePointsToMat()
    {
        
    }

	isWithinTriangle(x, y)
	{
		/*let x = this.position.x;
		let y = this.position.y;
		let theta = v.heading();
		let y1 = (y + (this.triangleHeight/2)) * Math.cos(theta) - (x - (this.triangleWidth/2)) * Math.sin(theta) + centerY;
		let x1 = (y + (this.triangleHeight/2)) * Math.sin(theta) + (x - (this.triangleWidth/2)) * Math.cos(theta) + centerX;

		let y2 = (y + (this.triangleHeight/2)) * Math.cos(theta) - (x + (this.triangleWidth/2)) * Math.sin(theta) + centerY;
		let x2 = (y + (this.triangleHeight/2)) * Math.sin(theta) + (x + (this.triangleWidth/2)) * Math.cos(theta) + centerX;

		let y3 = (y - this.triangleHeight/2) * Math.cos(theta) - x * Math.sin(theta) + centerY;
		let x3 = (y - this.triangleHeight/2) * Math.sin(theta) + x * Math.cos(theta) + centerX;

		// get the area of the triangle
		let areaOrig = Math.abs((x2-x1)*(y3-y1) - (x3-x1)*(y2-y1));

		// get the area of 3 triangles made between the point
		// and the corners of the triangle
		let area1 = Math.abs( (x1-px)*(y2-py) - (x2-x)*(y1-y) );
		let area2 = Math.abs( (x2-px)*(y3-py) - (x3-x)*(y2-y) );
		let area3 = Math.abs( (x3-px)*(y1-py) - (x1-x)*(y3-y) );
		
		// if the sum of the three areas equals the original,
		// we're inside the triangle!
		if ((area1 + area2 + area3) == areaOrig) 
		{
			return true;
		}
		else
		{
			return false;
		}*/
	}

	rollover(x, y)
	{
		if(this.isWithinTriangle(x, y))
		{
			this.triangleBrightness = 255;
		}
		else
		{
			this.triangleBrightness = 0;
		}
	}

	drawVelocity()
	{
		//Draw arrow
		push();
		strokeWeight(3);
		translate(this.x, this.y);
		rotate(this.headingRadians);
		line(0,0,0,0-(this.velocity*(800/30))); //800 pixels wide is 30ft
		pop();
	}

	drawTriangle()
	{
		push();
		angleMode(RADIANS);
		translate(this.x, this.y);
		rotate(this.headingRadians);
		strokeWeight(1);
		triangle(0 - (this.triangleWidth/2), 0 + (this.triangleHeight/2), 0 + (this.triangleWidth/2), 0 + (this.triangleHeight/2), 0, 0 - (this.triangleHeight/2));
		fill(255);
		pop();
	}

	draw()
	{
		drawVelocity();
		drawTriangle();
	}
}