const punctuaion = "!@#$%^&*()-;:{},./<>?";
class Walker {
    constructor(startPos, startVel, startAccl) {
        //define inital state for the agent
        this.position = startPos;
        this.velocity = startVel;
        this.velocity.setMag(15);
        this.acceleration = startAccl;
    }

    update = (char) => {
        //reset to starting position when run into punctuation in the line
        if (punctuaion.indexOf(char) > -1) {
            this.position.set([0, height]);
            this.velocity.setHeading(0);
        }
        //pivit the direction based on characters and randomness
        else {
            const charCode = char.toLowerCase().charCodeAt(0);
            if (charCode > 96 && charCode < 123) {
                const pivotAngle = map(charCode, 96, 123, -HALF_PI, HALF_PI);
                this.acceleration.setHeading(random(-HALF_PI,0));
                this.acceleration.rotate(pivotAngle);
                this.velocity.add(this.acceleration);
                this.velocity.setMag(15);
            }
            this.draw(char);
            this.position.add(this.velocity);
            /* 
            //to loop around the edges around the canvas
            if (this.position.x > width || this.position.x < 0)
                this.position.x = (this.position.x + width) % width;
            if (this.position.y > height || this.position.y < 0)
                this.position.y = (this.position.y + height) % height; 
            */
        }
    }

    draw = (char) => {
        const angle = this.velocity.heading();
        push();
        const charCode = char.charCodeAt(0);
        //draw uppcase letter with different settings
        if (charCode > 64 && charCode < 91) {
            textSize(24);
            stroke('#880606');
            fill('#880606');
            strokeWeight(4);
        }
        //draw characters accordingly
        translate(this.position.x, this.position.y);
        rotate(angle);
        text(char, 0, 0);
        pop();
    }
}