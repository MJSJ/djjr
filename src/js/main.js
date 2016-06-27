$(".toggle_nav").click(function(){

});


$(".p_detail").delegate("a","click",function(e){
	
	var id = $(this).data("id");
	var html = template('snapshotTPL', snapshots[id]);
    $(".snapshot_wrapper figure").html(html);
	e.preventDefault();
	if(!$(".snapshot").hasClass("animated"))
		$(".snapshot").addClass("animated bounceInUp");
})

$(".snapshot_toggle").on("click",function(){
	$(".snapshot").removeClass("bounceInUp animated");
})