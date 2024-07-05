var mr = 0.1;


function Vehicle(x, y, dna){
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, -2);
    this.position = createVector(x, y);
    this.r = 6;
    this.maxspeed = 2;
    this.maxforce = 0.5;

    this.health = 1;

    this.dna = [];
    //if it has already dna dont change
    if(dna === undefined){
        //food weight
        this.dna[0] = random(-sliders[0].value(), sliders[0].value());
        //poison weight
        this.dna[1] = random(-sliders[1].value(), sliders[1].value());
        //food range of view
        this.dna[2] = random(0, sliders[2].value());
        //poison range of view
        this.dna[3] = random(0, sliders[3].value());
    }
    else{
        //food weight
        this.dna[0] = dna[0];
        if(random(1) < mr){
          this.dna[0] += random(-0.1, 0.1);
        }
        //poison weight
        this.dna[1] = dna[1];
        if(random(1) < mr){
          this.dna[1] += random(-0.1, 0.1);
        }
        //food range of view
        this.dna[2] = dna[2];
        if(random(1) < mr){
          this.dna[2] += random(-10, 10);
        }
        //poison range of view
        this.dna[3] = dna[3];
        if(random(1) < mr){
          this.dna[3] += random(-10, 10);
        }
    }


    this.update = function(){

        this.health -= sliders[5].value();
        //Update velocity
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxspeed);
        ///Update position
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    this.applyForce = function(force){
        this.acceleration.add(force);
    }

    this.behaviours = function(good, bad){
        var foodSteer = this.eat(good, sliders[7].value(), this.dna[2]);
        var poisonSteer = this.eat(bad, -sliders[9].value(), this.dna[3]);

        foodSteer.mult(this.dna[0]);
        poisonSteer.mult(this.dna[1]);

        this.applyForce(foodSteer);
        this.applyForce(poisonSteer);
    }

    //calculate steering force
    this.seek = function(target){
        var desired = p5.Vector.sub(target, this.position);

        ///scale to maximum speed   
        desired.setMag(this.maxspeed);

        //steering force = desired - this.velocity
        var steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce);

        return steer;
    }

    this.clone = function(){
        if(random(1) < sliders[4].value() * this.health / 10000){  
          return new Vehicle(this.position.x, this.position.y, this.dna);
        }
        else{
            return null;
        } 
    }

    this.eat = function(list, nutrition, perception){
        var closest = null;
        var min = Infinity;
        for(var i = list.length - 1; i >= 0; --i){
            var d = this.position.dist(list[i]);

            if(d < this.maxspeed){
                list.splice(i, 1);
                this.health += nutrition;
            }
            else{
                if(d < min && d < perception){
                    min = d;
                    closest = list[i];
                }
            }
        }

        if(closest != null){
            return this.seek(closest);
        }

        return createVector(0, 0);
    }

    this.dead = function(){
        return (this.health < 0);
    }
    
    this.display = function(){
        var theta = this.velocity.heading() + PI / 2;
        push();
        translate(this.position.x, this.position.y);
        rotate(theta);
        
        if(debug.checked()){
            strokeWeight(3);
            stroke(0, 255, 0);
            noFill(); 
            line(0, 0, 0, -this.dna[0] * 10);
            strokeWeight(2);
            ellipse(0, 0, this.dna[2] * 2);
            stroke(255, 0, 0);
            line(0, 0, 0, -this.dna[1] * 10);
            ellipse(0, 0, this.dna[3] * 2);
        }

        var green = color(0, 255, 0);
        var red = color(255, 0, 0);
        var col = lerpColor(red, green, this.health);
        fill(col);
        stroke(0);
        strokeWeight(1);
        if(debug.checked()){
            textSize(9);
            text(this.health.toFixed(2) + '', 10, 10);
        }
        stroke(200);
        strokeWeight(1);
        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);
        pop();
    }


    this.boundaries = function(){

        var d = 25;;
        var desired = null;

        if(this.position.x < d){
            desired = createVector(this.maxspeed, this.velocity.y);
        }
        else if (this.position.x > width - d) {
            desired = createVector(-this.maxspeed, this.velocity.y);
        }

        if (this.position.y < d) {
            desired = createVector(this.velocity.x, this.maxspeed);
        }
        else if (this.position.y > height - d) {
            desired = createVector(this.velocity.x, -this.maxspeed);
        }

        if (desired !== null) {
            desired.normalize();
            desired.mult(this.maxspeed);
            var steer = p5.Vector.sub(desired, this.velocity);
            steer.limit(this.maxforce / 2);
            this.applyForce(steer);

        }
     }
 }
