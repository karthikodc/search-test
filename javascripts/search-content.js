
var total_page_discussion =0;
var total_page_document =0;
var total_page_blog =0;

// On-view-load initialization
function init() {
      $("#search").click(search);
      gadgets.window.adjustHeight();
}


//onhover event of expand icon
$("span.image-button").live('mouseover', function () {
                var curRowId = $(this).attr("id");
	        if(curRowId.indexOf("DOC") != -1){
	           var docID = (curRowId.substring(curRowId.lastIndexOf("-"))).substr(1);
	           console.log("i'm in if section:document");
	           expandDocument(docID);
	        }
	        else if(curRowId.indexOf("post") != -1){
			var blogpostId = (curRowId.substring(curRowId.lastIndexOf("-"))).substr(1);
			console.log("i'm in if section:blogID::"+blogpostId);
			var finalBlogId=(blogpostId.substring(blogpostId.lastIndexOf("/"))).substr(1);
			console.log("i'm in if section:PostID::"+finalBlogId)
			expandBlog(finalBlogId,blogpostId);
		}
		else
		{
			console.log("i'm in else section");
			expandDiscussion(curRowId);
		}

 });
    
 //function for tabs   
 $(function() {
         $( "#tabs" ).tabs();
        
 });

//function for date format
 function monthConvert(d){

  var outMonth="";
    switch (d) {
	    case '01':
	    outMonth= "Jan";
	    break;
	    case '02':
	    outMonth= "Feb";
	    break;
	    case '03':
	    outMonth= "Mar";
	    break;
	    case '04':
	    outMonth= "Apr";
	    break;
	    case '05':
	    outMonth= "May";
	    break;
	    case '06':
	    outMonth= "Jun";
	    break;
	    case '07':
	    outMonth= "Jul";
	    break;
	    case '08':
	    outMonth= "Aug";
	    break;
	    case '09':
	    outMonth= "Sep";
	    break;
	    case '10':
	    outMonth= "Oct";
	    break;
	    case '11':
	    outMonth= "Nov";
	    break;
	    case '12':
	    outMonth= "Dec";
	    break;
    }
 return outMonth;
}
       
//function for expand button to display the discussions with correct and helpful answers
function expandDiscussion(id){
        
	$(".content").html("");
	$('.firstdiv').css('background-color', '#FFFFFF');
	$('#div_'+id).css('background-color', '#F2F2F2');
	console.log("Expand Row Id::: "+ id);
	var discussionMessage="";
	var correctanswer="";
	var helpfulanswer="";
	var rootmessage="";
	var myDate="";
	
	var request = osapi.jive.core.discussions.get({id: id});
	request.execute(function(response) { 
	         console.log("Expanding discussion response is " + JSON.stringify(response.data));
	         var discussionresult=response.data;
		
		if (response.error) {
			console.log("Error in get: "+response.error.message);
		}
		    
		else{
			myDate=response.data.creationDate.substr(0,10);                  
			myDate=myDate.split("-"); 
			dateM=myDate[1];
			var finalMonth=monthConvert(dateM);
			var newDate=finalMonth+" "+myDate[2]+","+myDate[0]; 
		        console.log("I'm inside Root Message Div");
		        rootmessage +='<div class="rootborder">';
			rootmessage +='<div class="root-header"><a href="'+discussionresult.messages.root.resources.html.ref+'" target="_apps">'+discussionresult.messages.root.subject+'</a></div>';
			rootmessage +='<div class="content-date"> by <a class="nopad" href=https://apps-onprem.jivesoftware.com/people/'+response.data.author.username+'>'+response.data.author.name+'</a> on '+newDate+'</div>';	
			rootmessage +='<span class="root">'+discussionresult.messages.root.content.text+'</span>';                                        
                        rootmessage +='</div>';				
			rootmessage +='</div>';
		
			var request = response.data.messages.get();
			request.execute(function(response) {
			var result = response.data;
				if(!response.error) {
					
				    $.each(result, function(index, row) {
							console.log("Expanding discussion container response is " + JSON.stringify(response.data));
							var count=0;
							if(row.answer){
									myDate=row.creationDate.substr(0,10);                  
									myDate=myDate.split("-"); 
									dateM=myDate[1];
									var finalMonth=monthConvert(dateM);
									var newDate=finalMonth+" "+myDate[2]+","+myDate[0]; 
									console.log("I'm inside expand if");
									correctanswer +='<div class="answerborder">';								
									correctanswer +='<div class="correct">Correct Answer</div> ';									
									correctanswer +='<div class="content-date"> by <a class="nopad" href=https://apps-onprem.jivesoftware.com/people/'+row.author.username+'>'+row.author.name+'</a> on '+newDate+'</div>';									
									correctanswer +='<span class="root">'+row.content.text+ '</span>';								
									correctanswer +='</div>';
							
							  }
							  if(row.helpful){
									myDate=row.creationDate.substr(0,10);                  
									myDate=myDate.split("-"); 
									dateM=myDate[1];
									var finalMonth=monthConvert(dateM);
									var newDate=finalMonth+" "+myDate[2]+","+myDate[0]; 
									console.log("I'm inside expand if");
									helpfulanswer +='<div class="answerborder">';							
									helpfulanswer +='<div class="helpful">Helpful Answer </div>';								
									helpfulanswer +='<div class="content-date"> by <a class="nopad" href=https://apps-onprem.jivesoftware.com/people/'+row.author.username+'>'+row.author.name+'</a> on '+newDate+'</div>';									
									helpfulanswer +='<span class="root">'+row.content.text+ '</span>';								
									helpfulanswer +='</div>';
							
							  }
					
					   });
					discussionMessage +=rootmessage;
					discussionMessage +=correctanswer;
					discussionMessage +=helpfulanswer;
					console.log("Html Content:: "+discussionMessage);
					$(".content").show();
					$(".content").html(discussionMessage);
				
				   }
			
			});
		
		}

	});

}


//function for expand button to display the documents
function expandDocument(id){
	$(".content").html("");
	$('.firstdiv').css('background-color', '#FFFFFF');
	$('#div_'+id).css('background-color', '#F2F2F2');
       //  $('#div_'+id).css({"background-color":"#F2F2F2","background-repeat": "no-repeat"});
		console.log("You are in document section id ::"+id);
		var request = osapi.jive.core.documents.get({id: id});
		var documentdata="";
		request.execute(function(response) { 
		               console.log("Expanding document response is " + JSON.stringify(response.data));
		               var discussionresult=response.data;
		               var isBinaryDoc=0;
		               var myDate="";
		    try {
			if (response.data.content.binary.ref) {
				isBinaryDoc = 1;
	                }
			else {
				isBinaryDoc = 0;
			}	
		    }
		    catch (err) {
			isBinaryDoc = 0;
		    }
		
		        if (response.error) {
				console.log("Error in get: "+response.error.message);
			}
			else{
				if(isBinaryDoc !=0)
				  {       
				        myDate=response.data.creationDate.substr(0,10);                  
			                myDate=myDate.split("-"); 
			                dateM=myDate[1];
					var finalMonth=monthConvert(dateM);
					var newDate=finalMonth+" "+myDate[2]+","+myDate[0]; 
					documentdata += '<div class="rootborder">';
					documentdata += '<span class="root-header"><a href="'+response.data.resources.html.ref+'" target="_app">';						
					documentdata += response.data.subject+'</a></span>';
					documentdata +='<div class="content-date"> by <a class="nopad" href=https://apps-onprem.jivesoftware.com/people/'+response.data.author.username+'>'+response.data.author.name+'</a> on '+newDate+'</div></div>';				
					documentdata += '<div class="answerborder">';
					documentdata +='<span class="root">'+response.data.content.binary.description+'</span>';
					documentdata += '<span class="subtext">This document contains an uploaded document (PDF/DOC). ';
					documentdata += 'Please click <a target="_app" href="'+response.data.resources.html.ref+'">here</a> to open the document</span></div>';
					documentdata +='</div>';
				  }
				  else
				  {
					myDate=response.data.creationDate.substr(0,10);                  
			                myDate=myDate.split("-"); 
			                dateM=myDate[1];
				        var finalMonth=monthConvert(dateM);
					var newDate=finalMonth+" "+myDate[2]+","+myDate[0]; 
					documentdata +='<div class="rootborder">';					
					documentdata +='<span class="root-header"><a target="_app" href="'+response.data.resources.html.ref+'">';
					documentdata += response.data.subject+'</a></span>';
					documentdata +='<div class="content-date"> by <a class="nopad" href=https://apps-onprem.jivesoftware.com/people/'+response.data.author.username+'>'+response.data.author.name+'</a> on '+newDate+'</div>';
					documentdata +='</div>';					
					documentdata +='<div class="answerborder">';
					documentdata +='<span class="root">'+response.data.content.text +'</span></div>';				
                                        
				  }
			    }
			    $(".content").show();
			    $(".content").html(documentdata);
		  });
}

//function for expand button to display the blog
function expandBlog(blogId, blogpostId){
	var postId=blogpostId;
	var finalpostId=postId.substr(0,postId.indexOf('/'))
	console.log("Inside Blog expand and post id is"+finalpostId);
	$(".content").html("");
	$('.firstdiv').css('background-color', '#FFFFFF');
	$('#div_'+finalpostId).css('background-color', '#F2F2F2');
	console.log("Inside Blog expand");
	var blogdata="";
	var request = osapi.jive.core.blogs.get({id:blogId});
		request.execute(function(response) {
		console.log("Blog Post is"+JSON.stringify(response.data));
		var request = response.data.posts.get();
			request.execute(function(response) {
				console.log("Posts in blog"+JSON.stringify(response.data));
				var result = response.data;
				if(!response.error) {
				   $.each(result, function(index, row) {
			           if(finalpostId.indexOf(row.id) != -1)
				     {
				       var postresult=row.get();
				       postresult.execute(function(response) {
				       console.log("Post Post is"+JSON.stringify(response.data));
				       if (response.error) {
					   console.log("Error in get: "+response.error.message);
				        }
				      else{
				          myDate=response.data.creationDate.substr(0,10);                  
                                          myDate=myDate.split("-"); 
                                          dateM=myDate[1];
			                  var finalMonth=monthConvert(dateM);
				          var newDate=finalMonth+" "+myDate[2]+","+myDate[0]; 			    
					  blogdata +='<div class="rootborder">';
				          blogdata +='<span class="root-header"><a target="_app" href="'+response.data.resources.html.ref+'">';
					  blogdata += response.data.subject+'</a></span>';
					  blogdata +='<div class="content-date"> by <a class="nopad" href=https://apps-onprem.jivesoftware.com/people/'+response.data.author.username+'>'+response.data.author.name+'</a> on '+newDate+'</div>';
					  blogdata +='</div>';							
					  blogdata +='<div class="answerborder">';
					  blogdata +='<span class="root">'+response.data.content.text +'</span></div>';	
					}
					  $(".content").show();
					  $(".content").html(blogdata);
				   });


			        }


			    });

			}

		});
	});

}
function showPage(page,type)
{
 //$(".maindiv").hide();
if(type=="discussion")
{
var totalPage=total_page_discussion;
}
else if(type=="document")
{
var totalPage=total_page_document;
}
else(type=="blog")
{
var totalPage=total_page_blog;
}

 var selectedPage=".div_page_"+type+"_"+page;
 console.log("Inside show page:::"+selectedPage +"Total Page::"+totalPage);
 for (var i = 1; i <=totalPage; i++) {
      if(i==page)
	  {
		console.log("Inside show if" +i);
		$('.div_page_'+type+'_'+i).css('display', 'block');
		//$(selectedPage).show();
		//$(".maindiv").show();
	  }
	  else
	  {
		console.log("Inside hide else" +i);
		$('.div_page_'+type+'_'+i).css('display', 'none');
		 //$('.div_page_'+type+'_'+i).hide();
	  }
    }
 
	
}




// Perform a search and display the results
function search() {
    
    $("search-results").html("");
	$(".content").html("");
	$(".content").hide();
    gadgets.window.adjustHeight();
	var html = "";
    var params = {
        //limit : $("#limit").val(),
        query : $("#query").val(),
        //sort : $("#sort-type").val(),
       // sortOrder : $("#sort-order").val()
     
        
    };

   
    console.log("searching for " + JSON.stringify(params));
    osapi.jive.core.searches.searchContent(params).execute(function(response) {
       console.log("searching response is " + JSON.stringify(response));
       
        if (response.error) {
            alert(response.error.message);
        }
        else {
           
			var all="";
			var blog="";
			var discussion="";
			var update="";
			var document="";
			var post="";
			
            var rows = response.data;
            var url="";
            var subject="";
            var contentSummary="";
            var author="";
            var avatar="";
            var createdDate="";           
            var replyCount="";
            var likeCount="";
            var type="";
            var username="";
            var myDate="";
			var isAnswered = 0;
			var isQuestion = 0
			var intial_discussion=1;
			var intial_document=1;
			var intial_blog=1;
			var loop_check_discussion=0;
			var loop_check_document=0;
			var loop_check_blog=0;
			var items_per_page =1;
			var newcontent = '';
			var page_index=0;
			var page="";
			var discussion_name="discussion";
			var display_discussion="display:block";
			var display_document="display:block";
			var display_blog="display:block";
			var paginate_discussion='<li><a href="#" onclick="showPage(1,\'discussion\'); return false;">1</a></li>';
			var paginate_document='<li><a href="#" onclick="showPage(1,\'document\'); return false;">1</a></li>';
			var paginate_blog='<li>a href="#" onclick="showPage(1,\'blog\'); return false;">1</a></li>';
			 
            $.each(rows, function(index, row) {
            	url=row.resources.html.ref;
				subject=row.subject;
               	contentSummary=row.contentSummary;
                author=row.author.name;
                createdDate=row.creationDate;                   
                likeCount=row.likeCount;
                replyCount=row.replyCount;
                type=row.type;
                avatar=row.author.avatarURL;
                username=row.author.username;
				
				try {
					if (row.question) {
						isQuestion = 1;
					}
					else {
						isQuestion = 0;
					}	
				}
				catch (err) {
					isQuestion = 0;
				}
				
				try {
					if (row.resources.answer.ref) {
						isAnswered = 1;
					}
					else {
						isAnswered = 0;
					}	
				}
				catch (err) {
					isAnswered = 0;
				}
                myDate=row.modificationDate.substr(0,10);                  
                myDate=myDate.split("-"); 
                dateM=myDate[1];
				var finalMonth=monthConvert(dateM);
				var newDate=finalMonth+" "+myDate[2]+","+myDate[0]; 
					
                        if(row.type=="discussion"){
						
								
								var discussionID = (url.substring(url.lastIndexOf("/"))).substr(1);
								var discussionImage="";
								if(isQuestion)
								{
								if(isAnswered != 0){
								discussionImage +='<span class="jive-icon-med jive-icon-discussion-correct"></span>';
												
								 }
								 else
								 {
								  discussionImage +='<span class="jive-icon-med jive-icon-discussion-question"></span>';
								  }						
								}
										
									 else
								{
								  discussionImage +='<span class="jive-icon-med jive-icon-discussion"></span>';
								}
								
								console.log("intial_discussion value "+intial_discussion);
								console.log("loop_check_discussion value "+loop_check_discussion +"items_per_page  "+items_per_page);
								
								if((loop_check_discussion>=items_per_page)&& (loop_check_discussion%items_per_page==0))
								{
									console.log("Inside If value ");
									
									intial_discussion=intial_discussion+1;
									display_discussion="display:none";
									//paginate +="<li><a href='#' onclick='showPage(i); return false;'>"+i+"</li>";	
									paginate_discussion += '<li><a href="#" onclick=showPage("'+ intial_discussion + '","discussion"); return false;>' + intial_discussion + '</a></li>';
								}
								else
								{
									intial_discussion=intial_discussion;
								}
								var page="page_discussion_"+intial_discussion;
								console.log(page);
								console.log(paginate_discussion);
								
								discussion +='<div id="div_'+discussionID+'" class="firstdiv" >'; 
								discussion +='<div class="div_'+page+'" style="'+display_discussion+'">';								
								  discussion +='<ul>';			
				                discussion +=discussionImage+'<li><a href="'+url+'" target="_apps">'+subject+'</a></li>';			
                                discussion +='</ul>';
                                discussion +='<ul>';
				                discussion +='<span class="jive-icon-med image-button " id="'+discussionID+'"></span>';
                    		    discussion +='</ul>'; 
					
				             discussion +='<div class="root1">';  
                    		discussion +='<ul>';                   
                    		discussion +='<li>Created by <a class="nopad" href=https://apps-onprem.jivesoftware.com/people/'+username+'>'+author+'</a></li>';
				            discussion +='&nbsp;&nbsp<li>Date:'+newDate+'</li>';                    
                    		discussion +='&nbsp;&nbsp<li>Replies:'+replyCount+'</li>'; 
                    		discussion +='</ul>';
				             discussion +='</div>';
					
				                discussion +='<div class="root">';
                                discussion +='<ul>';                   
                   		        discussion +='<div class="align">'+contentSummary+'</div>';                  
                    	        discussion +='</ul>';
								discussion +='</div>';				                
								discussion +='</div>';
								discussion +='</div>';
								loop_check_discussion=loop_check_discussion+1
								
                        }
						total_page_discussion = intial_discussion;
               
						if(row.type=="document"){
						
							var docID = (url.substring(url.lastIndexOf("-"))).substr(1);
							
							console.log("intial_document value "+intial_document);
								console.log("loop_check_document value "+loop_check_document +"items_per_page  "+items_per_page);
								
								if((loop_check_document>=items_per_page)&& (loop_check_document%items_per_page==0))
								{
									console.log("Inside If value ");
									
									intial_document=intial_document+1;
									display_document="display:none";
									//paginate +="<li><a href='#' onclick='showPage(i); return false;'>"+i+"</li>";	
									paginate_document += '<li><a href="#" onclick=showPage("'+ intial_document + '","document"); return false;>' + intial_document + '</a></li>';
								}
								else
								{
									intial_document=intial_document;
								}
								var page="page_document_"+intial_document;
								console.log(page);
								console.log(paginate_document);
                    		document +='<div id="div_'+docID+'" class="firstdiv"> ';
							document +='<div class="div_'+page+'" style="'+display_document+'">';	
							document +='<ul>';
                    		document +='<span class="jive-icon-med jive-icon-document"></span><li> <a href="'+url+'" target="_apps">'+subject+'</a></li>';
                    		document +='</ul>';
                    		document +='<ul>';
							document +='<span class="jive-icon-med image-button" id="DOC-'+docID+'" ></span>';
                    		document +='</ul>';
                    
							document +='<div class="root1">'; 
                    		document +='<ul>';
							document +='<li>Created by <a class="nopad" href=https://apps-onprem.jivesoftware.com/people/'+username+'>'+author+'</a></li>';
							document +='<li>Date:'+newDate+'</li>';                  
                    		document +='<li>Replies:'+replyCount+'</li>';
							document +='</ul>';
                    		document +='</div>';
					
							document +='<div class="root">';
                    		document +='<ul>';                    
                    		document +='<div class="align">'+contentSummary+'</div>';                   
                    		document +='</ul>';
							document +='</div>';
                                       
                    		document +='</div>';
							document +='</div>';
                    		//document +='<br>';
							loop_check_document=loop_check_document+1
                      
                        }
						total_page_document = intial_document;
					if(row.type=="post"){
					
							var postDetailsId=row.resources.self.ref;
							var blogSummaryId=row.blogSummary.resources.self.ref;
							var blogId = (blogSummaryId.substring(blogSummaryId.lastIndexOf("/"))).substr(1);
							var postId = (postDetailsId.substring(postDetailsId.lastIndexOf("/"))).substr(1);
							if((loop_check_blog>=items_per_page)&& (loop_check_blog%items_per_page==0))
								{
									console.log("Inside If value ");
									
									intial_blog=intial_blog+1;
									display_blog="display:none";
									//paginate +="<li><a href='#' onclick='showPage(i); return false;'>"+i+"</li>";	
									paginate_blog += '<li><a href="#" onclick=showPage("'+ intial_blog + '","blog"); return false;>' + intial_blog + '</a></li>';
								}
								else
								{
									intial_blog=intial_blog;
								}
								var page="page_blog_"+intial_blog;
							
							post +='<div id="div_'+postId+'" class="firstdiv"> ';
								post +='<div class="div_'+page+'" style="'+display_blog+'">';	
							post +='<ul>';
							post +='<span class="jive-icon-med jive-icon-blog"></span><li class="post" ><a href="'+url+'" target="_apps">'+subject+'</a></li>';
							post +='</ul>';
							post +='<ul>';
							post +='<span class="jive-icon-med image-button" id="post-'+postId+'/'+blogId+'" ></span>';                            
							post +='</ul>';
                    
							post +='<div class="root1">'; 
							post +='<ul>';
							post +='<li>Created by <a class="nopad" href=https://apps-onprem.jivesoftware.com/people/'+username+'>'+author+'</a></li>';
							post +='<li>Date:'+newDate+'</li>';                  
							post +='<li>Replies:'+replyCount+'</li>'; 
							post +='</ul>';
							post +='</div>';
					
							post +='<div class="root">';    
							post +='<ul>';  
							post +='<div class="align">'+contentSummary+'</div>';  
							post +='</ul>';
							post +='</div>'; 
                                    
							post +='</div>';  
							post +='<br>';		
							loop_check_blog=loop_check_blog+1							
							             
					}
				total_page_blog = intial_blog;	
                                  
            });
          
			
				
            //console.log(html);
			//all +=discussion;
			//all +="<br>"+document;
			//all +="<br>"+post;
			
			console.log("discussion::"+discussion);
			//$("#tabs-1").html(all);
			discussion +='<div class="pagingControls">Page:'+paginate_discussion+'</div>';
			
			$("#tabs-1").html(discussion);
			document +='<div class="pagingControls">Page:'+paginate_document+'</div>';
			console.log("document::"+document);
			$("#tabs-2").html(document);
			blog +='<div class="pagingControls">Page:'+paginate_blog+'</div>';
			$("#tabs-3").html(post);
            $("#search-info").show();
			gadgets.window.adjustHeight();
        }
    });
}
    


// Register our on-view-load handler
gadgets.util.registerOnLoadHandler(init);
