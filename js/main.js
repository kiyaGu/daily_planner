$(document).ready(function(){
    
    $('#add-task').on("submit", function(){
        
        addTask();   
        
    });
    $("#edit-task").on("submit", function(){        
        updateTask();        
    });
    
    //clear all tasks
    
    $("#clearTasks").on("click",function(){
        clearAllTasks();  
        
    });
    
    //remove a task parent table taskTable
    $("#taskTable").on("click","#removeTask",function(){
     id = $(this).data("id");
     removeTask(id);
    });
    
    displayTasks();
    // function to display the tasks
    
    function displayTasks(){
        var taskList = JSON.parse(localStorage.getItem("tasks"));
        if(taskList != null){
            taskList = taskList.sort(sortByDate);
            }
        // set a counter for the loop
        var i = 0;
        //check tasks
        if(localStorage.getItem("tasks") != null){
            //loop through and display
            $.each(taskList, function(key,value){
               $("#taskTable").append("<tr id="+value.id+">"+
                                      "<td>" + value.task + "</td>" +                        
                                      "<td>" + value.taskPriority + "</td>"+
                                      "<td>" + value.taskDate + "</td>" +
                                      "<td>" + value.taskTime + "</td>"+
                                      "<td><a href='edit.html?id="+ value.id + "'>Edit</a> | <a href='#' id='removeTask' data-id="+ value.id+" >Remove</a></td> "+
                                      "</tr>"); 
                
            });
        }
    }
    function sortByDate(a,b){
         a = a.taskDate;
         b = b.taskDate;
        if (a == b){
            a = a.taskTime;
            b = b.taskTime;
            
        }
        
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    }
    
    // function to add a task
    function addTask(){
        //add unique id
        var newDate = new Date();
        id = newDate.getTime();        
        var task = $("#task").val();
        var taskPriority = $("#priority").val();
        var date = $("#date").val();
        var time = $("#time").val();
        validate(task, taskPriority, date, time);
            
        
    
    }
    //function to update task
    function updateTask(){
       var id = $("#task_id").val();
       var task = $("#task").val();
       var taskPriority = $("#priority").val();
       var date = $("#date").val();
       var time = $("#time").val();
        validate(task, taskPriority, date, time);
        taskList = JSON.parse(localStorage.getItem("tasks"));        
        if(taskPriority !="x" && task != "" && date != "" && time != ""){
        for(var i=0; i < taskList.length; i++){
           if(taskList[i].id == id){
             taskList.splice(i,1);
             break;
            } 
            
            
        }localStorage.setItem("tasks", JSON.stringify(taskList)); 
        }
    }
    
    function validate(task, taskPriority, date, time){
        
        if (task == ""){
            $("div#taskError").html("<h5 class=\" errorDisplay\">Please, write the task</h5>");          
            event.preventDefault();          
            
        }else if(taskPriority == "x"){
            $("div#priorityError").html("<h5 class=\"errorDisplay\">Please, assign priority to the task</h5>");
            $("div#taskError").text("");
            event.preventDefault(); 
        }else if(date == ""){
            $("div#dateError").html("<h5 class=\"errorDisplay\">Please, select the date</h5>");
            $("div#taskError").text("");
            $("div#priorityError").text("");
            event.preventDefault(); 
        }else if(time == ""){
            $("div#timeError").html("<h5 class=\" errorDisplay\">Please, select the time</h5>");
            $("div#priorityError").text("");
            $("div#dateError").text("");
            event.preventDefault(); 
        }  else{
            tasks = JSON.parse(localStorage.getItem("tasks"));
            //check tasks
            if(tasks == null){
                tasks = [];
            }
            var taskList = JSON.parse(localStorage.getItem("tasks"));
            
            //new task object
            var new_task = {
                "id":id,
                "task" :task,
                "taskPriority":taskPriority,
                "taskDate": date,
                "taskTime": time
            }
            tasks.push(new_task);
            localStorage.setItem("tasks", JSON.stringify(tasks));//because localstorage saves data as string by default
        }
        
    }
    function removeTask(id){
        if(confirm("Are you sure you want to delete this task ?")){
            var taskList =JSON.parse(localStorage.getItem("tasks"));
            for (var i=0; i < taskList.length; i++){
               if(taskList[i].id == id){
                 taskList.splice(i,1);  
               } 
                localStorage.setItem("tasks", JSON.stringify(taskList));
            }
            location.reload();
        }
    }
    function clearAllTasks(){
        
      if(confirm("Are you sure you want to delete all tasks?")){
          localStorage.clear();
          location.reload();
      }  
        
    }
    
});
//function for getting single task
function getTask(){
    var $_GET = getQueryParams(document.location.search);
    id = $_GET['id'];
    var taskList = JSON.parse(localStorage.getItem("tasks"));
    for(var i=0; i < taskList.length; i++){
        if(taskList[i].id == id){
            $("#edit-task #task_id").val(taskList[i].id);
            $("#edit-task #task").val(taskList[i].task);
            $("#edit-task #priority").val(taskList[i].taskPriority);
            $("#edit-task #date").val(taskList[i].taskDate);
            $("#edit-task #time").val(taskList[i].taskTime);
        }
    }
}

//function to get HTTP GET requests
function getQueryParams(qs){
    qs = qs.split("+").join(" ");
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;//Using a regular expression literal, which consists of a pattern enclosed between slashes
    while (tokens = re.exec(qs)){
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }
     return params;
    
}
