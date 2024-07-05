var vehicles = [];
var food = [];  
var poison = [];
var sliders = [];
var sliderVals = [];
var measurementUnit = ['', '', 'px', 'px', '', 'health/sec', 'food/sec', 'health', 'poison/sec', '-health'];

var debug;
var addFood;
var addPoison;
var addVehicle;
var removeVeh;

function setup(){
    createCanvas(1000, 700);

    debug = createCheckbox('Display debugging info');

    addFood = createButton('Add more food');
    addFood.position(760 , 720);
    addFood.style('font-size', '15px');
    addFood.style('background-color', 'green');

    addPoison = createButton('Add more poison');
    addPoison.position(880, 720);
    addPoison.style('font-size', '15px');
    addPoison.style('background-color', 'red');

    addVehicle = createButton("Add vehicle");
    addVehicle.position(520, 720);
    addVehicle.style('font-size', '15px');

    removeVeh = createButton("Remove all Vehicles");
    removeVeh.position(320, 720);
    removeVeh.style('font-size', '15px');
    removeVeh.style('background-color', 'red');

    //create sliders
    labelArray = ['Food Attraction Force', 'Poison Attraction Force', 'Food Perception Radius', 'Poison Perception Radius', 'Reproduction rate', 'Health decay', 'Food rate', 'Food value', 'Poison rate', 'Poison value'];
    for (var i = 0; i < 10; i++) {
  
  // Create a slider
        var label = createP(labelArray[i]);
        label.position(1030, 50 * i);
        var slider;
        if(i === 0){
            slider = createSlider(0, 10, 2, 1);
        }
        if(i === 1){
            slider = createSlider(0, 10, 2, 1);
        }
        if(i === 2){
            slider = createSlider(0, 500, 100,  50);
        }
        if(i === 3){
            slider = createSlider(0, 500, 100,  50);
        }
        if(i === 4){
            slider = createSlider(0, 10, 1, 1);
        }
        if(i === 5){
            slider = createSlider(0, 0.01, 0.001, 0.001);
        }
        if(i === 6){
            slider = createSlider(0, 1, 0.05,  0.05);
        }
        if(i === 7){
            slider = createSlider(0, 1, 0.2, 0.05);
        }
        if(i === 8){
            slider = createSlider(0, 1, 0.05, 0.05);
        }
        if(i === 9){
            slider = createSlider(0, 1, 0.5, 0.05);
        }
        slider.position(1200, 50 * i + 20);

        slider.style('background-color', '#2fad4a');
        slider.style('outline', 'none');
        slider.style('height', '10px');
        slider.style('border-radius', '5px');
        slider.style('cursor', 'pointer');
        sliders.push(slider);
        var sliderVal = createP(sliders[i].value());
        sliderVal.position(sliders[i].x + sliders[i].width + 15, sliders[i].y - 18);
        var l = createP(measurementUnit[i]);
        l.position(sliderVal.x + 50, sliderVal.y);
        sliderVals.push(sliderVal);
    }

    for(var i = 0; i < 50; ++i){
        var x = random(width);
        var y = random(height);
        vehicles[i] = new Vehicle(x, y);
    }
    for(var i = 0; i < 100; ++i){
        var x = random(width);
        var y = random(height);  
        food.push(createVector(x, y));
    }  
    for(var i = 0; i < 20; ++i){
        var x = random(width);
        var y = random(height);
        poison.push(createVector(x, y));
    }
}


function draw(){
    background(51);
    for(var i = 0; i < 10; ++i){
        sliderVals[i].html(sliders[i].value());
    }
    //create food at random intervals of time
    if(random(1) < sliders[6].value()){
        var x = random(width);
        var y = random(height);  
        food.push(createVector(x, y));
    }

    //create poison at random intervals of time
    if(random(1) < sliders[8].value()){
        var x = random(width);
        var y = random(height);  
        poison.push(createVector(x, y));
    }

    for(var i = 0; i < food.length; ++i){
        fill(0, 255, 0);
        noStroke();
        ellipse(food[i].x, food[i].y, 8, 8);
    }

    for(var i = 0; i < poison.length; ++i){
        fill(255, 0, 0);
        noStroke();
        ellipse(poison[i].x, poison[i].y, 8, 8);
    }
    for(var i = vehicles.length - 1; i >= 0; --i){
        vehicles[i].boundaries();
        vehicles[i].behaviours(food, poison);
        vehicles[i].update();
        vehicles[i].display();

        var newVehicle = vehicles[i].clone();
        if(newVehicle != null){
            vehicles.push(newVehicle);
        }

        if(vehicles[i].dead()){
            food.push(createVector(vehicles[i].position.x, vehicles[i].position.y));
            vehicles.splice(i, 1);
        }

    }

    addFood.mousePressed(() => {
        for(var i = 0; i < 10; ++i){
            var x = random(width);
            var y = random(height);  
            food.push(createVector(x, y));
        }
    });

    addPoison.mousePressed(() => {
        for(var i = 0; i < 10; ++i){
            var x = random(width);
            var y = random(height);  
            poison.push(createVector(x, y));
        }
    });
    addVehicle.mousePressed(() => {
        vehicles.push(new Vehicle(width / 2, height / 2));
    });

    removeVeh.mousePressed(() => {
        vehicles.splice(0, vehicles.length);
    });

}