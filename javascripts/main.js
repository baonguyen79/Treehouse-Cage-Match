$(function(){
	// Set up click button
	$(":button").on("click", (e) => {
        e.preventDefault();
        let player1 = $("#player1").val();
        let player2 = $("#player2").val();

        retrieveJSON(player1 , player2);
       
    });

});

// Retrieve players' JSONs function
const retrieveJSON = (player1, player2) => {

	// Player1 JSON
	const loadTreehousePlayer1 = () => {
		return new Promise((resolve, reject) => {
			$.ajax(`https://teamtreehouse.com/${player1}.json`)
			.done((data1) => resolve(data1))
			.fail((error) => reject(error));
		});
	};	

	// Player2 JSON
	const loadTreehousePlayer2 = () => {
		return new Promise((resolve, reject) => {
			$.ajax(`https://teamtreehouse.com/${player2}.json`)
			.done((data1) => resolve(data1))
			.fail((error) => reject(error));
		});
	};	


	// Promise all
	Promise.all([loadTreehousePlayer1() , loadTreehousePlayer2()])
	    .then((result) => {
	    	makeDom(result[0], result[1]);
	    	})
	    .catch((dataError) => {
	    	$("#winnerAlert").html(`<strong>! ERROR Load JSON`).addClass("winnerAlert");
	    	$(":button").val("Reset Cage Match");
	    });

	$(":button").off("click").on("click", () => {
        window.location.reload();
       
    });

};


// Make DOM function
const makeDom = (result1 , result2) => {

    let picture = $("#picture");            //player1 image
    let imgString = "";
    imgString  = `<div class="image">`;
    imgString += `<img id="pl1" src=${result1.gravatar_url}>`;
    imgString += `<p style="font-weight:bold;">${result1.profile_name}</p>`;
    imgString += `</div>`;  

    picture.append(imgString);				//Player2 image
    imgString  = `<div class="image">`;
    imgString += `<img id="pl2" src=${result2.gravatar_url}>`;
    imgString += `<p style="font-weight:bold;">${result2.profile_name}</p>`;
    imgString += `</div>`;  
    picture.append(imgString);

    //Get players points
	let player1Count = result1.points.total;  
	let player2Count = result2.points.total;

	// Setup point counters animation
	$("#count-player1").text(player1Count).addClass("count");
	$("#count-player2").text(player2Count).addClass("count");

	$('.count').each(function() {

		$(this).prop('Counter', 0).animate({             //Counting
			Counter: $(this).text()
			}, {
			
			duration: 4000,
			easing: 'swing',
			step: function (now) {

				$(this).text(Math.ceil(now));
				},
			
			complete: function() {						//Done counting
				let winnerAlert = " No winner";
				if (player1Count > player2Count) {
					winnerAlert = result1.profile_name;
					$("#pl1").addClass("winner");
      				makeBadges(result1.badges);
				} else {
					if (player1Count < player2Count){
					   winnerAlert = result2.profile_name;
					   $("#pl2").addClass("winner");
					   makeBadges(result2.badges);
					} 
				}
      			$("#winnerAlert").html(`<strong>! Winner ${winnerAlert}</strong>`).addClass("winnerAlert");
      			$(".winner").toggle( "pulsate" ).css("border", "4px solid red");
      			$(":button").val("Reset Cage Match");
      			    			
			}
		});  

	});  

};

// Make winner badges DOM
const makeBadges = (badges) => {
	let domString = "";

	for (let j = 0; j < badges.length; j++){
	    domString += `<div><img src="${badges[j].icon_url}"></div>`;
	    };

	$("#badges").html(domString);
};

