"use strict";

var canvas;
var gl;

var points = [];

var numTimesToSubdivide = 0;
var angleTwist = 0;

var bufferId;

function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.


    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width+0.1, canvas.height+0.1 );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, 8*Math.pow(3, 6), gl.STATIC_DRAW );



    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

        document.getElementById("sliderS").onchange = function(event) {
        numTimesToSubdivide = parseInt(event.target.value);
        render();
    };

        document.getElementById("sliderT").onchange = function(event) {
        angleTwist = parseInt(event.target.value);
        render();
    };


    render();
};

function triangle( a, b, c )
{
    //points.push( a, b, c );
    points.push( a,b,b,c,c,a );
}

function divideTriangle( a, b, c, count )
{

    // check for end of recursion

    if ( count == 0 ) {
        triangle( tw(a,angleTwist), tw(b,angleTwist), tw(c,angleTwist) );
    }
    else {

        //bisect the sides

        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

        // four new triangles

        divideTriangle( a, ab, ac, count );
        divideTriangle( c, ac, bc, count );
        divideTriangle( b, bc, ab, count );
        divideTriangle( ac, bc, ab, count );
    }
}

window.onload = init;

function tw(p, angle) {
  //console.log(Object.prototype.toString.call(p));
  var d = Math.sqrt(p[0]*p[0]+p[1]*p[1]);
  var angle_rad = d*angle*Math.PI/180;
  var np = vec2(p[0]*Math.cos(angle_rad) - p[1]*Math.sin(angle_rad), p[0]*Math.sin(angle_rad) + p[1]*Math.cos(angle_rad));
  
  return np;
}

function render()
{
    var vertices = [
        //vec2( -1, -1 ),
        //vec2(  0,  1 ),
        //vec2(  1, -1 )
        vec2( -0.86, -0.5 ),
        vec2(  0,  1 ),
        vec2(  0.86, -0.5 )
    ];
    points = [];
    divideTriangle( vertices[0], vertices[1], vertices[2], numTimesToSubdivide);

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));
    gl.clear( gl.COLOR_BUFFER_BIT );
    //gl.drawArrays( gl.TRIANGLES, 0, points.length );
     gl.drawArrays( gl.LINES, 0, points.length );
    points = [];
}
