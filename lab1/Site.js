document.addEventListener('DOMContentLoaded', function(){
	centerDiv();
	window.onresize = centerDiv;
});

function centerDiv() {
	var mainContentDiv = document.querySelector(".mainContent");
	var centeredContentDiv = document.querySelector(".centeredContent");
	if(mainContentDiv  && centeredContentDiv) {
		centeredContentDiv.style.marginTop = (mainContentDiv.offsetHeight/2 - centeredContentDiv.offsetHeight/2)+"px";
		centeredContentDiv.style.marginLeft = (mainContentDiv.offsetWidth/2 - centeredContentDiv.offsetWidth/2)+"px";
	}
};