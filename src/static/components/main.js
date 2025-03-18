const canvas = document.getElementById("robotCanvas");
const ctx = canvas.getContext("2d");

        // Length of each arm (in pixels)
const arm1Length = 100;
const arm2Length = 100;
const arm3Length = 20;

let locationString;
let lastLocationString;
let lastSent;

        // Fixed joint position (base of the robot arm)
const fixedJoint = { x: canvas.width / 2, y: canvas.height / 2 };

        // Sliders for controlling the angles of the arms
const slider1 = document.getElementById("angle-slider1");
const slider2 = document.getElementById("angle-slider2");
const slider3 = document.getElementById("angle-slider3")
const slider4 = document.getElementById("angle-slider4");

const angleDisplay1 = document.getElementById("angle-display1");
const angleDisplay2 = document.getElementById("angle-display2");
const angleDisplay3 = document.getElementById("angle-display3");
const angleDisplay4 = document.getElementById("angle-display4");

const sliderList = document.getElementsByClassName("slider");

setInterval(() => {
    if (lastSent !== locationString) {
        sendSliderValue(lastLocationString)
        lastSent = lastLocationString
    }
}, 1000)

        // Update the angle display when the sliders change
slider1.addEventListener("input", function() {
    
    angleDisplay1.textContent = slider1.value;

    locationString = slider1.value +"." + slider2.value +"." + slider3.value +"." + slider4.value
    
    lastLocationString = locationString
    // sendSliderValue(locationString)

    drawArm();
});

slider2.addEventListener("input", function() {

    angleDisplay2.textContent = slider2.value;

    locationString = slider1.value +"." + slider2.value +"." + slider3.value +"." + slider4.value

    lastLocationString = locationString
    // sendSliderValue(locationString)

    drawArm();
});

slider3.addEventListener("input", ()=>{

    angleDisplay3.textContent = slider3.value;

    locationString = slider1.value +"." + slider2.value +"." + slider3.value +"." + slider4.value

    lastLocationString = locationString
    // sendSliderValue(locationString)

    drawArm();
    

})

slider4.addEventListener("input", ()=>{

    angleDisplay4.textContent = slider4.value;

    locationString = slider1.value +"." + slider2.value +"." + slider3.value +"." + slider4.value
    
    lastLocationString = locationString
    // sendSliderValue(locationString)

    drawArm();

})

function drawArm() {
        // First arm angle (controlled by slider1, starting from +Y axis (90 degrees))
        const angle1 = parseFloat(slider1.value) * Math.PI / 180; // Convert slider1 value to radians
        const angle2 = parseFloat(slider2.value) * Math.PI / 180; // Convert slider2 value to radians
        const angle3 = parseFloat(slider3.value) * Math.PI / 180;
        const angle4 = parseFloat(slider4.value) * Math.PI / 180; // Angle from slider4 to rotate arm3 and arm3.1 together
    
        // Calculate position of the first joint (end of the first arm)
        const arm1End = {
            x: fixedJoint.x + arm1Length * -Math.cos(angle1),
            y: fixedJoint.y + arm1Length * -Math.sin(angle1)
        };
    
        // Calculate position of the second joint (end of the second arm)
        const arm2End = {
            x: arm1End.x + arm2Length * Math.cos(angle2),
            y: arm1End.y + arm2Length * Math.sin(angle2)
        };
    
        // Calculate arm3End and arm3_1End based on the current angles
        const arm3End = {
            x: arm2End.x + arm3Length * Math.cos(angle2 + angle3),
            y: arm2End.y + arm3Length * Math.sin(angle2 + angle3)
        };
    
        const arm3_1End = {
            x: arm2End.x + arm3Length * Math.cos(angle2 - angle3),
            y: arm2End.y + arm3Length * Math.sin(angle2 - angle3)
        };
    
        // Now, apply a transformation matrix to rotate arm3 and arm3_1 around arm2End using slider4
        // Step 1: Translate arm3End and arm3_1End to origin (relative to arm2End)
        const translateToOrigin = (point, origin) => {
            return {
                x: point.x - origin.x,
                y: point.y - origin.y
            };
        };
    
        // Step 2: Apply rotation matrix
        const rotate = (point, angle) => {
            const cosAngle = Math.cos(angle);
            const sinAngle = Math.sin(angle);
            return {
                x: point.x * cosAngle - point.y * sinAngle,
                y: point.x * sinAngle + point.y * cosAngle
            };
        };
    
        // Step 3: Translate back to arm2End
        const translateBack = (point, origin) => {
            return {
                x: point.x + origin.x,
                y: point.y + origin.y
            };
        };
    
        // Rotate both arm3End and arm3_1End around arm2End using the transformation matrix
        const rotatedArm3End = rotate(translateToOrigin(arm3End, arm2End), angle4);
        const rotatedArm3_1End = rotate(translateToOrigin(arm3_1End, arm2End), angle4);
    
        // Translate the rotated points back to the original position
        const finalArm3End = translateBack(rotatedArm3End, arm2End);
        const finalArm3_1End = translateBack(rotatedArm3_1End, arm2End);
    
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineCap = "round";
    
        drawGradientLine(fixedJoint, arm1End, "#42aaff", "#1e77b8"); // Base to first joint
        drawGradientLine(arm1End, arm2End, "#ff4b5c", "#b8333f"); // First to second joint
        drawGradientLine(arm2End, finalArm3End, "#28a745", "#218838"); // Left gripper
        drawGradientLine(arm2End, finalArm3_1End, "#28a745", "#218838"); // Right gripper
    
        // Draw the joints (circle at the base and between the arms)
        drawJoint(fixedJoint, "#f1c40f"); // Base joint
        drawJoint(arm1End, "#f1c40f"); // First joint
        drawJoint(arm2End, "#f1c40f"); // Second joint

        ctx.beginPath();
        ctx.strokeStyle = "#FF0000"
        ctx.lineWidth = 5;
        ctx.strokeRect(fixedJoint.x-40,fixedJoint.y+7,80,100);

    }
    
    // Initial drawing
    drawArm();
    
    function drawGradientLine(from, to, color1, color2) {
        const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 12; // Thicker line for better visibility
        ctx.shadowColor = "rgba(0, 0, 0, 0.2)"; // Slight shadow for depth
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow after drawing
    }

    function drawJoint(position, color) {
        ctx.beginPath();
        ctx.arc(position.x, position.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow
    }    

    function sendSliderValue(value){
        fetch('/receive', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ value: value })  // Send the slider value as JSON
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();  // Parse the response as JSON
        })

        .catch(error => {
            // Handle any errors
            console.error('Error:', error);
            console.log('An error occurred while sending data.');
        });
    }