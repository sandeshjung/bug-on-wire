import { bugHeight, bugWidth, bugY, jumpHeight, wires } from "./constant.js";

export default class Bug {
    constructor(context, bugX, wireIndex) {
        this.context = context;
        this.bugX = bugX;
        this.wireIndex = wireIndex;
        this.bugY = bugY;
        this.isJumping = false;
        this.isJumpingOverObstacle = false;
        this.jumpStartY = undefined;

    }

    drawBug() {
        this.context.fillStyle = "green";
        this.context.fillRect(this.bugX - (bugWidth / 2), bugY - (bugHeight / 2), bugWidth, bugHeight);
    }

    moveBug(direction) {
        console.log(this.bugX)

        this.wireIndex += direction;
        this.wireIndex = Math.max(0, Math.min(wires.length - 1, this.wireIndex));

        this.bugX = wires[this.wireIndex].x;
        this.drawBug();
    }

    startJump(){
        this.isJumping = true;
        this.isJumpingOverObstacle = false;
        this.jumpStartY = bugY;
        this.jump();
    }

    jump = ()=>{
        if(this.isJumping){
            this.bugY -= 3;
            if (this.bugY <= this.jumpStartY - jumpHeight){
                this.isJumping = false;
            }
            requestAnimationFrame(this.jump);
        } else {
            this.fall();
        }
    }

    fall = () => {
        if (this.bugY < bugY){
            this.bugY += 5;
            if (this.bugY >= bugY){
                this.isJumpingOverObstacle = false;
            }
            requestAnimationFrame(this.fall);
            // console.log(this.bugY)
        } else {
            this.bugY = bugY;
        }
    }

}