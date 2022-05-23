import { getContext, getTranslatedRectangle, pointInRectangle, translateToCanvas } from "./util.js";

export class Button {
    constructor(text, rectangle_specifier){
        this.text = text;
        this.x = rectangle_specifier.x;
        this.y = rectangle_specifier.y;

        this.width = rectangle_specifier.width;
        this.height = rectangle_specifier.height;
    }

    draw(){
        var context = getContext();

        var rectangle = getTranslatedRectangle(this);

        var center_x = Math.round(rectangle[0] + rectangle[2]/2);
        var center_y = Math.round(rectangle[1] + rectangle[3]/2);

        context.globalAlpha = 0.5;
        context.fillStyle = "black";
        context.fillRect(...rectangle);
        context.globalAlpha = 1;

        context.font = '50pt sans-serif';
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(this.text, center_x, center_y);
    }

    hasCursor(mousex, mousey){
        
        var rectangle = getTranslatedRectangle(this);

        var point = [mousex, mousey];

        return pointInRectangle(point, rectangle);
    }
}