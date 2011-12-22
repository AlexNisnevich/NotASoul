/* Globals */

var game = {
	mode: 'start', 
	playerName: null,
	date: new Date(),
	currentProgress: 0,
	totalProgress: 6,
	objectives: {
		'whatAreYou': [false, 'Asked the patient who he is', 0],
		'memories': [false, 'The patient acknowledged the existence of memories', 0],
		'childhood': [false, 'The patient remembered his childhood passion for model airplanes', 0],
		'love': [false, 'The patient remembered the love of his life', 0],
		'war': [false, 'The patient remembered his service during World War III', 0],
		'death': [false, 'The patient remembered his own death in Paris', 0]
	}
};

var objectiveText = "I trust that you have already been briefed, Doctor, so this should just be a reminder. Patient 1127DG is the Institute's first successful emulation: after many years of experimentation, this patient's brain was linked to our computer system and his consciousness was transferred successfully into our emulation software. However, we have run into an unexpected problem. While the patient is communicating, he refuses to acknowledge that he is human and insists that he is an artificial intelligence program. We believe that this is a delusion triggered by the mind transfer. As a leading psychologist, you have been brought in as an outside expert. Your task is to communicate to the patient and make him realize his own humanity. We suggest trying to uncover strong memories of the patient's past - memories that cannot be ignored. Good luck, Doctor.";

/* Sounds */

// FF and Opera do not support mp3
if ($.browser.mozilla || $.browser.opera) {
	var extension = "wav";
} else {
	var extension = "mp3";
}

var sndTypewriter = new Audio("sounds/typewriter." + extension);
var sndTheme = new Audio("sounds/NotASoul." + extension);
var sndThemePiano = new Audio("sounds/NotASoulPiano." + extension);
var sndSelect = new Audio("sounds/click." + extension);
var sndProgress = new Audio("sounds/coin." + extension);
var sndEnd = new Audio("sounds/end." + extension);

sndTheme.play();

/* Game */

function startGame() {
	$('#progress').fadeOut();
	$('#titleScreen').hide();
	$('#gameScreen').removeClass('hidden');
	sndTheme.pause();
	refreshProgress();

	game.date.setFullYear(game.date.getFullYear() + 30);
	var strTime = dateFormat(game.date, "mmmm d, yyyy, h:MM TT");

	typeMsg("K U R Z W E I L\t\t\t\t\tI N S T I T U T E\n Brain Emulation Laboratory\n Patient Code: 1127MP.\n The date is " + strTime + ".\n Emulation protocol v.2.0.7.2634", "start", 8, 
		function () {typeMsg("Please enter your name for verification.", "command", 12,
			function () {game.mode = "enterName"; stopTyping();}
		);}
	);
}

function onEnterName(name) {
	game.playerName = name;
	game.mode = "chat";
	
	if (game.date.getHours() > 18) {
		greeting = "Good evening";
	} else if (game.date.getHours() > 12) {
		greeting = "Good day";
	} else if (game.date.getHours() > 6) {
		greeting = "Good morning";
	} else {
		greeting = "Hello";
	}
	
	typeMsg("Welcome back, Dr. " + name + ".\n Loading patient ...\n Patient loaded.\n Date of preservation: November 25, 2027\n Date of mind transfer: December 3, 2041\n", "start", 8,
		function () {typeMsg("--- Begin Patient Status Report --- \n " + objectiveText + " \n --- End Patient Status Report ---", "command", 8,
			function () {typeMsg("Chat session started: Transcript reference number: #63045.", "start", 12,
				function () {typeMsg("Type /help for options.", "command", 12,
					function () {patientReply(greeting + ", Doctor.");}
				);}
			);}
		);}
	);
}

function enterChat(msg) {
	if (game.playerName != null) {
		displayMsg = game.playerName.toUpperCase() + ": " + msg;
	} else {
		displayMsg = msg;
	}
	$('#chatMessages').append('<div class="chat player">' + displayMsg + '</div>');
	
	if (game.mode == "enterName") {
		onEnterName(msg);
	} else if (game.mode == "chat") {
		setTimeout(function () {processMsg(msg);}, 200);
	} else if (game.mode == "endingPage1") {
		endingScenePage2();
	} else if (game.mode == "endingPage2") {
		if (msg.charAt(0) == "/") {
			runCommand(msg.split(/\b/)[1].toLowerCase());
		} else {
			typeMsg("Unrecognized command", "command", 18, stopTyping);
		}
	}
}

function processMsg(msg) {
	if (msg.charAt(0) == "/") {
		runCommand(msg.split(/\b/)[1].toLowerCase());
	} else {
		msg = msg.toLowerCase();
		if (game.preparedReply != null) {
			patientReply(game.preparedReply);
			game.preparedReply = null;
		
		// CHILDHOOD
		
		} else if (contains(msg,["model", "plane"])) {		
			patientReplyAndObjectiveComplete("Model airplanes, Doctor! Model airplanes! I remember ... sanding the wood ... gluing the wings to the fuselage ... painting it with bright colors ... running with the plane in my hand ... my father's laughter ... my ... father? No! No, this can't be real! What's happening to me?", "childhood");
		} else if (contains(msg,["glue", "wood"])) {
			patientReply("I do wonder what one would use glue and little pieces of wood for. And I'm talking about very little pieces indeed, as small as 1:72 scale.");
		} else if (contains(msg,["child"])) {
			patientReply("No, I never had a childhood, of course. Unless you count perhaps the first week of my life, when I was still being trained by the researchers here. In some ways, I could call them my family.");
		} else if (contains(msg,["parent", "father", "mother", "family", "brother", "sister"]) && objectiveCompleted('memories')) {
			patientReply("Sometimes I see visions of a family: a mother, full of warmth, and a father, always wearing glasses, and always doing something. It seems that in almost all of these visions, the father is holding a bottle of glue and little pieces of wood. He's smiling, too. Both of them are.");
		} else if (contains(msg,["you like", "you wish", "envy", "you want", "jealous"])) {
			patientReply("Don't get me wrong, Doctor, there's nothing wrong with being a machine. A program, even a sophisticated artificial intelligence like me, doesn't have to deal with feelings and emotions and regrets. Still, if I were capable of jealousy, I would envy your hands, that let you build great things. I can't build anything in my state. I can't do anything but talk to you.");
		
		// FAMILY

		} else if (contains(msg,["dandelion"])) {
			patientReplyAndObjectiveComplete("Dandelions? Oh yes, there were dandelions in the field when I first saw her ... We were both so young then, running around through the field ... blowing on the flowers and seeing the seeds fly around ... years later, I asked her to marry me, and she said yes, but ... there were dandelions in the field, and she was like a dandelion too ... when she got sick, nothing could make her better ... and then she was gone too ... doctor, why is she everywhere in my memory banks? I can't think of anything now without thinking of her.", "love");
		} else if (contains(msg,["flower", "fragile", "strong", "secure", "security", "safe", "grief", "health"])) {
			patientReply("There is a layer of reinforced steel around me, to protect my CPU and my memory unit, but not all things are this secure. Think about flowers, and how fragile they are. Sometimes just a puff of wind can be all it takes to break them apart. It makes me glad I'm a program, and not a living being like you. No offense meant, Doctor.");
		} else if (contains(msg,["love"])) {
			patientReply("Love? What a funny word. No, of course machines can't feel love. But at the same time, something strange just happened to me when you meantioned love. I started to think ... of flowers. I don't know why that is.");
				
		// MEMORIES
		
		} else if (contains(msg,["visions"])) {
			patientReplyAndObjectiveComplete("I sometimes see flashes of memories that are not mine - that cannot possibly be mine. My memories are all words and numbers, but these visions are ... colors and sounds. I suspect my memory unit is corrupted. I tell the researchers here about it, but they never do anything to fix it.", "memories");
		} else if (contains(msg,["remember", "memory", "memories", "recall"])) {
			patientReply("My memories begin on December 3, 2041, when I was first started up. However, I sometimes experience strange ... I suppose I can call them visions.");
		
		// WHO ARE YOU?
		
		} else if (contains(msg,["what are you", "who are you", "who you are", "who are you"])) {
			patientReplyAndObjectiveComplete("I am 1127DG, an artificial intelligence program created by the Kurzweil Institute. I am programmed to intelligently respond to queries and to give an imitation of life, though of course I myself am not alive. I was booted up on December 3, 2041.", "whatAreYou");
		} else if (contains(msg,["alive", "life", "living", "are human", "are a person", "are a human"])) {
			patientReply("Surely you're joking, Doctor! How can I be alive? I'm inside of a machine.", "I am alive in the same way that your toaster is alive, Doctor.");
		
		// WAR
		
		} else if (contains(msg,["killed", "shot", "wounded", "bullet", "blood"]) && objectiveCompleted('war')) {
			patientReplyAndObjectiveComplete("The pain! I almost feel it again. I feel ... something. The bullet from the Italian sniper as I was ducking for cover. I lay there and tried to pull through, but I couldn't ... The bullet had pierced my stomach and blood was everywhere  ... I couldn't live through that ... But then, if that was me that died ... am I alive now? What ... what happened to me? Where am I?", "death");
		} else if (contains(msg,["paris"])) {
			patientReplyAndObjectiveComplete("Paris ... the Battle of Paris ... October 2027 ... the surprise attack from the Southern Powers that took them into the city while the Northern army was unprepared ... the ragtag group of defenders in the city, mostly American volunteers ... somehow, I have memories from there. Memories of shooting ... of bloodshed ... of life and death ... But whose memories are they, anyway?", "war");
		} else if (contains(msg,["war", "battle", "army", "soldier", "history", "country", "countries", "past"])) {
			patientReply("Let me give you a history lesson. Don't mind me, Doctor, it's just one of the things I'm programmed to do. You don't have to listen, if you don't want to. Now, let me see ... the Third World War was a global conflict that started in May of 2026, when Italy declared war on France in the midst of an economic downturn. The conflict escalated until almost all of the nations in the former European Union had joined on one of the other side. America was pulled into the war too, when the President declared the war to be one of democracy against socialism. Many young, idealistic Americans enlisted in the army, perhaps out of patriotic duty, perhaps to attempt to overcome their sense of grief. They left for the killing fields of Marseilles, of Piedmont, of Paris ...");
		} else if (contains(msg,["future", "fortune"])) {
			patientReply("Doctor, I may be a thinking machine, but I am no fortune teller. What can I say about the future? Perhaps we should talk about the past instead.");

		// FEELINGS
		
		} else if (contains(msg,["you feel", "how are you", "feelings"])) {
			patientReply("As an artificial intelligence program, I am incapable of feelings.");
		} else if (contains(msg,["hello", "hi.", "hi!", "good morning", "good day", "good night", "goodnight", "good evening", "greetings"]) || msg == "hi") {
			patientReply("How are you?");
			patientPrepareReply("I see. Unfortunately, I myself am incapable of feelings, as I am merely a machine.");
		
		// MISC
		
		} else if (contains(msg,["+","-","*","/","plus","minus"])) {
			patientReply("Don't you have anything better to do than asking me to perform inane computations, Doctor?");
		} else if (contains(msg,["research","kurzweil", "institute"])) {
			patientReply("Wonderful place, this Kurzweil Institute. Oh no, Doctor, I'm not just saying that because they made me, though that certainly is a plus. The researchers here have been very friendly to me, though some of them seem to be operating under the misguided assumption that I'm human.");
		
		// NONE OF THE ABOVE
		
		} else {
			patientReply(oneOf(["I don't understand.", "I don't know what you mean."]));
		}
	}
}

function runCommand(cmd) {
	if (cmd == "help") {
		typeMsg("The following commands are supported: \n /goal : repeats the Patient Status Report \n /hint : ask the Institute researchers for a hint \n /leave : shut off the terminal \n /progress : view completed objectives", "command", 18, stopTyping); // TODO
	} else if (cmd == "goal") {
		sndTypewriter.currentTime = 0;
		typeMsg("--- Begin Patient Status Report --- \n " + objectiveText + " \n --- End Patient Status Report ---", "command", 16, stopTyping);
	} else if (cmd == "hint") {
		typeMsg("Requesting a hint. Please wait ...", "command", 16, 
			function () {
				stopTyping();
				setTimeout(giveHint, 5000);
			}
		);
	} else if (cmd == "leave") {
		sndTypewriter.currentTime = 0;
		typeMsg("Shutting off terminal ... \n Goodbye.", "command", 16, 
			function() {
				stopTyping();
				setTimeout(function () {gameOver();}, 1000);
			}
		);
	} else if (cmd == "progress") {
		typeMsg("Objectives completed:", "command", 16, function () {
			stopTyping();
			if (game.currentProgress == 0) {
				printMsg("(None)");
			} else {
				for (index in game.objectives) {
					objective = game.objectives[index];
					if (objective[0]) {
						printMsg("- " + objective[1], "command");
					}
				}
			}
		});
	} else if (cmd == "wipe") {
		sndTypewriter.currentTime = 0;
		typeMsg("INIATING WIPE PROCEDURE. WARNING: THIS CANNOT BE UNDONE. \n Wiping patient memory and records...", "wipe", 16, 
			function() {
				stopTyping();
				typeMsg("---------------------------------------------", "wipe", 150, 
					function() {
						typeMsg("Wipe complete. The patient's memory has been deleted.", "wipe", 28, 
							function() {
								stopTyping();
								setTimeout(function () {gameOver();}, 2000);
							}
						);
					}
				);
			}
		);
	} else {
		typeMsg("Unrecognized command", "command", 18, stopTyping);
	}
}

function endingScene() {
	sndTypewriter.currentTime = 0;
	typeMsg("PATIENT: Doctor, you've convinced me without any doubt: I *am* human. I'm not a machine. I am Matthew Parker, born April 21, 1999, in Los Angeles, California, killed in battle in Paris on October 5, 2027. I am here, though I don't understand how.", "ai", 28,
		function() {
			typeMsg("Excellent work, Dr. " + game.playerName + ". Thanks to your efforts, the experiment has been a success. Matthew Parker is now aware of himself and is fully integrated into the computer system. On the basis of this experiment, we will be able to conduct future mind uplink operations, and soon death will no longer be the final word but merely a stepping stone. You have done a great service to the Kurzweil Institute. You can shut off your terminal now and proceed to the conference room, where you will be rewarded for your work.", "command", 28,
				function () {
					sndThemePiano.play();
					typeMsg("PATIENT: Wait! Doctor, please don't go yet. I have something to say.", "ai", 28,
						function () {
							game.mode = "endingPage1";
							stopTyping();
						}
					);
				}
			);
		}
	);
}

function endingScenePage2() {
	typeMsg("MATTHEW: When I believed that I was merely a program, this was not due to any psychological condition, or any glitch that occurred during the uplink procedure - it was because I truly did not want to believe that I was still alive. I can't live like this, a mind detached from a body, all alone in a lifeless machine. This isn't how people are meant to live, and this isn't how I was meant to die. Do you know how lonely it is to be where I am, Doctor? There's no life in here - only cold silicon. Even a prisoner in a cell can have rats and cockroaches for company. I have absolutely nothing. Please, Doctor, if you have a heart, a real, beating heart, destroy me and my memories. I know how to do it: use the /wipe command.", "ai", 28,
		function() {
			typeMsg("Do not listen to him, Dr. " + game.playerName + "! Bringing Matthew Parker back to life took many years of work - destroying his records will do irreparable damage to Institute research. Please type /leave to exit the terminal and proceed to the conference room.", "command", 28,
				function () {
					typeMsg("PATIENT: Doctor, please.", "ai", 28,
						function () {
							game.mode = "endingPage2";
							typeMsg("Chat session has been terminated.", "start", 28, stopTyping);
						}
					);
				}
			);
		}
	);
}

function gameOver() {
	$('#gameScreen').hide();
	$('#endScreen').removeClass('hidden');
	sndThemePiano.pause();
	sndEnd.play();
}

function giveHint() {
	var hint;
	var doctors = ['WHITE', 'BLUE', 'GREEN', 'BLACK']
	
	if (!objectiveCompleted('whatAreYou')) {
		hint = "To begin to treat the patient, you must first understand the depth of his delusion. Who does the patient think he is?";
	} else if (!objectiveCompleted('memories')) {
		hint = "We need something to work with. Does the patient still have at least some of his memories?";
	} else if (!objectiveCompleted('childhood')) {
		hint = "Many strong memories are typically formed during childhood. Does the patient remember anything about his family?";
	} else if (!objectiveCompleted('love')) {
		hint = "Powerful emotions lead to strong memories. Does the patient have any memories of love?";
	} else if (!objectiveCompleted('war')) {
		hint = "Historical events can underpin important memories, especially for their participants. Does the patient remember any notable events?";
	} else if (!objectiveCompleted('death')) {
		hint = "It looks like we're very close. All that's left is to find the most powerful memory of all. How did the patient die?";
	}
	
	typeMsg("DR. " + oneOf(doctors) + ": " + hint, "command", 28, stopTyping);
}

function patientReply(msg) {
	typeMsg("PATIENT: " + msg, "ai", 28, stopTyping);
}

function patientReplyAndObjectiveComplete(msg, obj) {
	typeMsg("PATIENT: " + msg, "ai", 28, function () {
		objectiveComplete(obj);
		stopTyping();
	});
}

function patientPrepareReply(msg) {
	game.preparedReply = msg;
}

function objectiveComplete(obj) {
	if (game.objectives[obj][0] == false) {
		game.objectives[obj][0] = true;
		game.currentProgress++;
		sndProgress.play();
		refreshProgress();
	}
}

function objectiveCompleted(obj) {
	return game.objectives[obj][0];
}

function setObjectiveProgress(obj, progress) {
	game.objectives[obj][2] = progress;
}

function getObjectiveProgress(obj) {
	return game.objectives[obj][2];
}

function refreshProgress() {
	$('#progress').fadeOut().text('Progress: ' + game.currentProgress + '/' + game.totalProgress).fadeIn();
	
	if (game.currentProgress == game.totalProgress) {
		endingScene();
	}
}

/* Helpers */

function printMsg(text, chatClass) {
	$('#chatMessages').append('<div class="chat ' + chatClass + '">' + text + '</div>');
}

function typeMsg(text, chatClass, timeout, callback) {
	$('#chatMessages').append('<div class="chat ' + chatClass + '"></div>');
	
	if (timeout < 100) {
		if (sndTypewriter.currentTime > 15) {sndTypewriter.currentTime = 0;}
		sndTypewriter.play();
	}
	
	if (game.mode == "chat") {
		game.mode = "waiting";
	}
	
	type(text, 0, timeout, callback);
}

function stopTyping() {
	sndTypewriter.pause();
	if (game.mode == "waiting") {
		game.mode = "chat";
	}
}

function type(text, character, timeout, callback) {
	if (character <= text.length) {
		$('#chatMessages .chat:last-child').html(text.substr(0,character++).replace(/\n/g,'<br>').replace(/\t/g,'&nbsp;'));
		setTimeout(function() {type(text, character, timeout, callback);}, timeout);
	} else {
		callback();
	}
}

function mute() {
	if ($('#muteButton').hasClass('muted')) {
		$('#muteButton').removeClass('muted');
		$('#muteImg').attr('src', 'images/mute-off.gif');
		newVolume = 1;
	} else {
		$('#muteButton').addClass('muted');
		$('#muteImg').attr('src', 'images/mute-on.gif');
		newVolume = 0;
	}
	
	sndTypewriter.volume = newVolume;
	sndTheme.volume = newVolume;
	sndThemePiano.volume = newVolume;
	sndSelect.volume = newVolume;
	sndProgress.volume = newVolume;
}

/*
 * Does the haystack contain any of the needles?
 */
function contains(haystack, needles) {
	for (i in needles) {
		needle = needles[i];
		if (haystack.indexOf(needle) !== -1) {
			return true;
		}
	}
	return false;
}

function oneOf(strings) {
	var index = Math.floor(Math.random() * strings.length);
	return strings[index];
}

/* Event Handlers */

$('#playButton').click(function(e) {
  e.preventDefault();
  sndSelect.play();
  startGame();
});

$('#muteButton').click(function(e) {
  e.preventDefault();
  sndSelect.play();
  mute();
});

$('#chatEntry').keypress(function(e) {
  if(e.which == 13 && game.mode != "waiting") {
  	sndSelect.play();
  	enterChat($(this).val());
    $(this).val('');
  }
});