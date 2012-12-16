balloon.board = ( function(){
    var settings,
        jewels,
        cols,
        rows,
        baseScore,
        numJewelTypes;

    function initialize(){
        settings = balloon.settings;
        baseScore = settings.baseScore;
        rows = settings.rows;
        cols = settings.cols;
        numJewelTypes = settings.numJewelTypes;
        fillBoard();
        callback();
    }
    function print(){
        var str="";
        for(var y = 0; y < rows; y++){
            for(var x = 0; x < cols; x++){
                str+= getJewel(x,y) + " ";
            }
            str+="\r\n";
        }
        console.log(str);
    }

    function fillBoard(){
        var x, y,
         type;
        jewels=[];
        for(x=0; x<cols; x++){
            jewels[x] = [];
            for(y=0; y<cols; y++){
                type = randomJewel();
                while((type===getJewel(x-1, y) && type===getJewel(x-2, y)) ||
                    (type===getJewel(x, y-1) && type===getJewel(x, y-2))){
                    type = randomJewel();
                }
                jewels[x][y] = type;
            }
        }
    }

    function getJewel(x, y){
        if(x<0 || x>cols-1 || y<0|| y>rows-1){
            return -1;
        }
        return jewels[x][y];
    }

    function randomJewel(){
        return Math.floor(Math.random()*numJewelTypes);
    }

    //Returns the number of jewels in the longest chain that includes (x,y)
    function checkChain(x, y){
        var type = getJewel(x, y),
            left = 0, right = 0, up = 0 , down = 0;
        //look right
        while(type==getJewel(x+right+1,y)){
            right++;
        }
        while(type==getJewel(x-left-1,y)){
            left++;
        }
        while(type==getJewel(x+up+1,y)){
            up++;
        }
        while(type==getJewel(x-down-1,y)){
            down++;
        }
        return Math.max(left+1+right+up+1+down);
    }

    //return true if (x1,y1 can be swaped with (x2,y2) to form a new match
    function canSwap(x1, y1, x2, y2){
        var type1 = getSwap(x1,y1),
            type2 = getSwap(x2,y2),
            chain;
        if(!isAdjacent(x1,y1,x2,y2)){
            return false;
        }
        //temporarily swap jewels
        jewels[x1][y1] = type1;
        jewels[x2][y2] = type2;
        chain = (checkChain(x2, y2)>2||checkChain(x1,y1)>2);
        //swap back
        jewels[x1][y1] = type2;
        jewels[x2][y2] = type1;
        return chain;
    }
    //return true if they are adjacent
    function isAdjacent(x1, y1, x2, y2){
    var dx = Math.abs(x1-x2),
        dy = Math.abs(y1-y2)
        return (dx+dy === 1);
    }

    //return a two-dimensional map of chain-lengths
    function getChains(){
        var x, y,
            chains = [];
        for(x=0;x<cols;x++){
            chains[x] = [];
            for(y=0;y<rows;y++){
                chains[x][y] = checkChain(x,y);
            }
        }
        return chains;
    }

    function check(){
        var chains = getChains(),
            hadChains = false, score = 0,
            removed = [], moved = [], gaps = [];
            for(var x=0;x<cols;x++){
                gaps[x] = [];
                for(var y= rows-1;y>0;y--){
                    if(chains[x][y]>2){
                        hadChains = true;
                        gaps[x]++;
                        removed.push({x:x, y:y, type:getJewel(x,y)});
                    }
                    else{
                        if(gaps[x] > 0){
                            moved.push({toX:x, toY:y, type:getJewel(x,y)});
                        }
                        jewels[x][y + gaps[x]] = getJewel(x,y);
                    }
                }
            }
    }

    return{
        print:print,
        initialize:initialize,
        canSwap:canSwap
    }
}
        )();