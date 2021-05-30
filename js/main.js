 $(document).ready(function(){
    var grid_array = [];
    down=false;
    var buttonType = "not-selected";
    var srcDestType = null;
    var src_node=null;
    var dest_node=null;
    var random_maze_flag=false;
    var resistance_block_flag=false;
    var color ="rgb(255, 150, 100)";

    //Create Grid
    for(var i=0; i<1300; i++ ){
        var element = document.createElement("div");
        var squareName = "square"+i;
        element.setAttribute("class", "square");
        element.setAttribute("type", "not-selected");
        element.setAttribute("id",squareName)
        var curr = new node_graph(squareName,0,"c1d6ff");
        document.getElementsByClassName("chestboard")[0].appendChild(element);
        //Left
        if(i-1>=0 && i%50!=0){
            curr.addNi(i-1);
        }
        //Right
        if(i+1>=0 && (i+1)%50!=0){
            curr.addNi(i+1);
        }
        //Buttom Center
        if(i+50<1300){
            curr.addNi(i+50);
        }
        //Top Center
        if(i-50>=0){
            curr.addNi(i-50);
        }
        // //Top Left
        // if(i-51>=0 && i%50!=0){
        //     curr.addNi(i-51);
        // }
        // //Top Right
        // if(i-49>=0 && (i+1)%50!=0){
        //     curr.addNi(i-49);
        // }
        // //Buttom Left
        // if(i+49<1300 && i%50!=0){
        //     curr.addNi(i+49);
        // }
        // //Buttom Right
        // if(i+51<1300 && (i+1)%50!=0){
        //     curr.addNi(i+51);
        // }        
        grid_array[i]=curr;
    }

    //ButtonSelection
    $('.block-type-button').click(function(){
        buttonType=$(this).attr('id');
        srcDestType=null;
        console.log(buttonType);
        if(buttonType=="random-maze" && !random_maze_flag){
            $(".slidecontainer#maze-silder").attr("type", "visible");
            random_maze_flag = true;
            if(resistance_block_flag){
                $(".slidecontainer#resistance-silder").attr("type", "hidden");
                resistance_block_flag = false;
            }
            
        }
        else if(buttonType=="resistance-block" && !resistance_block_flag){
            $(".slidecontainer#resistance-silder").attr("type", "visible");
            resistance_block_flag = true;
            if(random_maze_flag){
                $(".slidecontainer#maze-silder").attr("type", "hidden");
                random_maze_flag = false;
            }
            
        }
        else{
            $(".slidecontainer").attr("type", "hidden");
            random_maze_flag = false;
            resistance_block_flag = false;
        }
        if(buttonType!="run"){
            $("#message").html("");
        }
    })
    $('.src-dest-button').click(function(){
        $("#message").html("");
        srcDestType=$(this).attr('id');
        buttonType="not-selected"
        $(".square[type='path']").each(function() {
            $(this).attr("type", "not-selected");
        });
        $(".slidecontainer").attr("type", "hidden");

    })
    $('.clear-all').click(function(){
        $("#message").html("");
        buttonType=$(this).attr('id');
        $(".square").each(function() {
            if($(this).attr("type")!="not-selected"){
            $(this).attr("type", "not-selected");
            grid_array[$(this).attr('id').substring(6)].setWeightString("not-selected");
            }
        });  
        $(".slidecontainer").attr("type", "hidden");
        src_node=null;
        dest_node=null;
    })


    //Random Maze Slider
    var slider_maze = document.getElementById("myRange-maze");
    var output_maze = document.getElementById("value-selection-maze");
    slider_maze.oninput = function(){
        output_maze.innerHTML=this.value;
        // console.log(color);
        // $(".square[type='stalling-block']").css("background-color", color);
        // console.log($(".square[type='stalling-block']").css("background-color"));
    }

    //Random resistance Slider
    var slider_resistance = document.getElementById("myRange-resistance");
    var output_resistance = document.getElementById("value-selection-resistance");
    slider_resistance.oninput = function(){
        output_resistance.innerHTML=this.value;
        color =  "rgb(255, "+(200-this.value)+",100)";
        console.log(color);
    }

    $('#create-maze').click(function(){
        $(".square").each(function() {
            if($(this).attr("type")!="not-selected" && $(this).attr("type")!="src" && $(this).attr("type")!="dest"){
            console.log($(this).attr("type"));
            $(this).attr("type", "not-selected");
            grid_array[$(this).attr('id').substring(6)].setWeightString("not-selected");
            }
        });  
        $("#message").html("");
        var size = $('.slider').val();
        for(var i=0; i<size; i++){
            var index = Math.floor(Math.random()*1300);
            var name = "square"+index;
            if(src_node!=name && dest_node!=name){
            $('#'+name).attr("type","blocking-block");
            grid_array[index].setWeightString("blocking-block");
            }
        }
    })


    //Dijkstra
    $('#run').click(function(){
        if(src_node!=null && dest_node!=null){
            var srcIndex = src_node.substring(6);
            var destIndex = dest_node.substring(6);
            var prev = Dijkstra(srcIndex, destIndex);
            var path = reconstructPath(prev, srcIndex, destIndex);
            for(var i=1; i<path.length-1;i++){
                console.log('.square'+path[i]);
                 $('#square'+path[i]).attr("type", "path");
            }
            if(path.length==0){
                $("#message").html("There is not path between the selcted source and destination");
            }
            else{
                $("#message").html("Success!");
            }
            function Dijkstra(src, dest){
                var pq = new PriorityQueue(); 
                var prev = [];
                var visited = [];
                var dist = 1.797693134862315E+308;
                grid_array[src].setTag(0);
                pq.enqueue(src, 0);
                while(!pq.isEmpty()){
                    var elemIndex = pq.dequeue().getElement();
                    var elem = grid_array[elemIndex];
                    if(typeof visited[elemIndex]=="undefined"){
                        visited[elemIndex]=1;
                        var elemNi = elem.getNi();
                        for(var i=0; i<elemNi.length; i++){
                            var niIndex = elemNi[i];
                            if(typeof visited[niIndex]=="undefined" && grid_array[niIndex].getWeight()!=100){
                                var distFromSrc = elem.getTag()+grid_array[niIndex].getWeight();
                                if(niIndex==dest){
                                    if(distFromSrc<dist){
                                        dist = distFromSrc;
                                    }
                                }
                                if(typeof prev[niIndex] == "undefined" ){
                                    grid_array[niIndex].setTag(distFromSrc);
                                    prev[niIndex]=elem.getNameKey();
                                    console.log("Here "+niIndex+" "+elem.getNameKey()+" " +elem.getWeight());
                                }
                                else if(distFromSrc<grid_array[niIndex].getTag()){
                                    grid_array[niIndex].setTag(distFromSrc);
                                    prev[niIndex]=elem.getNameKey();
                                    console.log("Here2 "+niIndex+" "+elem.getNameKey()+" " +elem.getWeight());

                                }
                                pq.enqueue(niIndex, grid_array[niIndex].getTag());

                            }


                        }
                    }


            }
            return prev;
        }

        function reconstructPath(prev, src, dest){
            var path_temp = [];
            var path = [];
            path_temp.push(dest);
            for(var i=dest; typeof prev[i]!= "undefined"; i=prev[i]){
                console.log(i + " " +prev[i]);
                path_temp.push(prev[i]);
            }
            if(!(path_temp.length==0) && path_temp[path_temp.length-1]==src){
                for(var i = path_temp.length-1; i>=0;i--){
                    path.push(path_temp[i]);
                }
            }
            return path;

        }
    }
    else{ 
        $("#message").html("Please choose source and destination first");
    }
    })



    //Mousedown
    $(document).mousedown(function() {
        down = true;
    }).mouseup(function() {
        down = false;  
    });


    $('.square').mousedown(function(){
        $(this).attr("type", buttonType);
        var index = $(this).attr('id').substring(6);
        if(buttonType =="resistance-block"){
            grid_array[index].setWeightInt($("myRange-resistance").val());
            $(this).css("background-color", color);
        }
        else{
            grid_array[index].setWeightString(buttonType);
        }

    })

    $('.square').mouseover(function(){
        if(down){
            $(this).attr("type", buttonType);
            var index = $(this).attr('id').substring(6);
            if(buttonType == "resistance-block"){
                grid_array[index].setWeightInt($("myRange-resistance").val());
                $(this).css("background-color", color);
            }
            else{
                grid_array[index].setWeightString(buttonType);
            }       
        }
        else{
            if($(this).attr("type")=="not-selected"){
                $(this).attr("type", "hover");
            }
        }
    })

    $('.square').on('mouseleave', function(){
        if($(this).attr("type")=="hover"){
        $(this).attr("type","not-selected");
        }
    })

    $('.square').mouseup(function(){
    })

    $('.square').click(function(){
        if(srcDestType=="source-node" && $(this).attr("type")!="blocking-block"){
            if(src_node!=null){
                $('#'+src_node).attr("type","not-selected");
            }
            src_node = $(this).attr('id');
            $(this).attr("type","src");


        }
        else if(srcDestType=="dest-node" && $(this).attr("type")!="blocking-block"){
            if(dest_node!=null){
                $('#'+dest_node).attr("type","not-selected");
            }
            dest_node = $(this).attr('id');
            $(this).attr("type","dest");
            console.log(dest_node);
        }
        
    })
    



    







})


class node_graph {
    constructor(squareName, tag, color){
        this.squareName = squareName;
        this.tag = tag;
        this.color = color;
        this.weight = 0;
        this.neighbors = []
    }

    setTag(tag){
        this.tag=tag;
    }
    setColor(color){
        this.color=color;
    }
    setWeightString(weightString){
        switch(weightString){
            case "not-selected":
                this.weight = 0;
                break;
            case "blocking-block":
                this.weight = 100;
                break;  
            default:
                this.weight = 0;
        }
    }
    setWeightInt(weightInt){
        this.weight = weightInt;
        console.log("Int");

    }

    getTag(){
        return this.tag;
    }
    getColor(){
        return this.color;
    }
    getWeight(){
        return this.weight;
    }
    getName(){
        return this.squareName;
    }
    getNameKey(){
        return this.squareName.substring(6);
    }

    addNi(nodeKey){
        this.neighbors.push(nodeKey);
    }
    getNi(){
        return this.neighbors;
    }


} 

class QElement { 
    constructor(element, priority) 
    { 
        this.element = element; 
        this.priority = priority; 
    } 

    getElement(){
        return this.element;
    }
}
class PriorityQueue { 
  
    constructor() 
    { 
        this.items = []; 
    } 
  
    enqueue(element, priority) 
    { 
        var qElement = new QElement(element, priority); 
        var contain = false; 
        for (var i = 0; i < this.items.length; i++) { 
            if (this.items[i].priority > qElement.priority) { 
                this.items.splice(i, 0, qElement); 
                contain = true; 
                break; 
            } 
        } 
        if (!contain) { 
            this.items.push(qElement); 
        } 
    }    
    
    dequeue() 
    { 
        if (this.isEmpty()) 
            return "Underflow"; 
        return this.items.shift(); 
    }   
    isEmpty() 
    { 
    return this.items.length == 0; 
    }  
    // front() 
    // printPQueue() 
}