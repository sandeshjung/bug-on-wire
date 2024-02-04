import { jumpHeight, boardHeight } from "./constant.js";


const startJump = () => {
    return {isJumping:true, isJumpingOverObstacle:false, bugY :(6 * boardHeight) / 8}
}

const jump = (state) => {
    const {isJumping, jumpStartY, bugY} = state;
    if (state.isJumping){ // check if the isJumping flag is true
        state.bugY -= 3; // Adjust the jump speed
        if (bugY <= jumpStartY - jumpHeight) { // check if the jumping distance is over or not 
             state.isJumping = false;// off the isJumping flag
             console.log(state.isJumping)
        }
        requestAnimationFrame(() => jump(state)); // jumping animation
    } else {
        // if isJumping is false then the bug needs to fall back to the wire
             return state;
    } 
}


const fall =(state) => {
    const {bugY} = state;
    if (bugY < (6 * boardHeight) / 8) { // check if the bug is in air or not ( the speed is decremented when in air)
        state.bugY += 5; // Adjust the fall speed
        if (bugY >= (6 * boardHeight) / 8) {  
            state.isJumpingOverObstacle = false;
        }
        requestAnimationFrame(state);
    } else { // if the bug gets out of bound set it back to the wire
        // state.bugY= (6 * boardHeight) / 8;
    }
}

export {startJump, jump, fall}