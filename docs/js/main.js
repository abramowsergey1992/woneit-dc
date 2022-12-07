var vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty("--vh", `${vh}px`);
var width = window.innerWidth;
window.addEventListener("orientationchange", () => {
	// alert("ss");
	var vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty("--vh", `${vh}px`);
});

$(function () {
	setTimeout(function () {
		$(".logo").addClass("_anim");
	}, 200);
	let user;
	if (Cookies.get("user")) {
		user = JSON.parse(Cookies.get("user"));
		console.log("spin", user);
		$("body").attr("screen", "game");
		$(".screen-game__col-spin").text(user.spin);
		$(".gift-link").attr("href", user.giftlink);
		if (user.spin == 0) {
			if (user.winner == true) {
				$("#pickgift").css("display", "block");
			} else {
				$("#final").css("display", "block");
			}
		}
	} else {
		$("body").attr("screen", "login");
	}
	$(".screen-welcome__start").click(function () {
		$("body").attr("screen", "game");
	});
	$(".allvideo-link").click(function () {
		$("body").attr("screen", "all");
	});
	$(".back-link").click(function () {
		$("body").attr("screen", "game");
	});
	pinCodMask = new Inputmask("9", { placeholder: " " });
	let pin = "";
	document.querySelectorAll("._pin-cod-mask").forEach((item) => {
		pinCodMask.mask(item);
		item.addEventListener("focus", function () {
			this.value = "";
		});
		item.addEventListener("blur", function () {
			pin = "";
			document.querySelectorAll("._pin-cod-mask").forEach((it) => {
				if (it.value.length) {
					pin += it.value;
				}
			});
			if (pin.length == 4) {
				document
					.querySelector(".login-form__sbmt")
					.removeAttribute("disabled");
			} else {
				document
					.querySelector(".login-form__sbmt")
					.setAttribute("disabled", "disabled");
			}
		});

		item.oninput = function () {
			if (item.getAttribute("name") != "n4") {
				item.nextSibling.nextSibling.focus();
			}
			pin = "";
			document.querySelectorAll("._pin-cod-mask").forEach((it) => {
				if (it.value.length) {
					pin += it.value;
				}
			});
			if (pin.length == 4) {
				document
					.querySelector(".login-form__sbmt")
					.removeAttribute("disabled");
			} else {
				document
					.querySelector(".login-form__sbmt")
					.setAttribute("disabled", "disabled");
			}
		};
	});

	document
		.querySelector(".login-form__sbmt ")
		.addEventListener("click", function () {
			$.ajax({
				url: $(".login-form").attr("action"),
				data: { pin: pin },
				method: "POST",
				headers: {
					"X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
						"content"
					),
				},
				context: document.body,
				success: function (data) {
					if (data.status == "success") {
						Cookies.set("user", JSON.stringify(data.user));
						user = data.user;
						console.log(user);
						$(".screen-game__col-spin").text(user.spin);
						$("body").attr("screen", "welcome");
						if (user.gender == "male") {
							$(".screen-welcome__gender").text("Уважаемый");
						} else {
							$(".screen-welcome__gender").text("Уважаемая");
						}
						$(".screen-welcome__name").text(user.name);
					}
					if (data.status == "error") {
						$(".login-form").addClass("_error");
						console.error("Ошибка отправки пин кода:", data.msg);
						setTimeout(function () {
							$(".login-form").removeClass("_error");
							$("._pin-cod-mask").val("");
							document
								.querySelector(".login-form__sbmt")
								.setAttribute("disabled", "disabled");
						}, 600);
					}
				},
				error: function (data) {
					console.log("error", data);
				},
			});
		});

	// создаем аудио контекст
	var context = new window.AudioContext(); //
	// переменные для буфера, источника и получателя
	var buffer, source, destination;

	// функция для подгрузки файла в буфер
	var loadSoundFile = function (url) {
		// делаем XMLHttpRequest (AJAX) на сервер
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.responseType = "arraybuffer"; // важно
		xhr.onload = function (e) {
			// декодируем бинарный ответ
			context.decodeAudioData(
				this.response,
				function (decodedArrayBuffer) {
					// получаем декодированный буфер
					buffer = decodedArrayBuffer;
				},
				function (e) {
					console.log("Error decoding file", e);
				}
			);
		};
		xhr.send();
	};
	loadSoundFile("audio/sp.mp3");
	let d = 360 / 20;
	let spinAudio = $(".game__spin")[0];
	let winAudio = $(".game__win")[0];
	let isSpin = false;
	let gift = [0, 6, 14];
	let prank = [3, 10, 16];
	let videos = [1, 2, 4, 5, 7, 8, 9, 11, 12, 13, 15, 17, 18, 19];
	let indx = 0;
	let prevspin = 0;
	let now = 0;
	$(".game__start").click(function () {
		if (!isSpin) {
			isSpin = true;
			prevspin = now;
			if (user.spin == 0) {
			} else if (user.spin == 1) {
				if (user.winner) {
					indx = Math.floor(Math.random() * gift.length);
					now = gift[indx];
				} else {
					indx = Math.floor(Math.random() * prank.length);
					now = prank[indx];
				}
			} else if (user.spin == 2) {
				indx = Math.floor(Math.random() * prank.length);
				now = prank[indx];
				prank.splice(indx, 1);
			} else {
				let indx = Math.floor(Math.random() * videos.length);
				now = videos[indx];
				videos.splice(indx, 1);
			}
			console.log("d", d);
			console.log("now", now);
			console.log("prevspin", prevspin);
			user.spin = user.spin - 1;

			let ps = prevspin * d + d;

			console.log("rotation", 360 + d * now);
			gsap.to(".game__drum", {
				rotation: 360 + d * now,
				duration: 9,
				ease: "out.power4",
				onUpdate: function () {
					let n = gsap.getProperty(this.targets()[0], "rotate");

					if (n >= ps) {
						ps = ps + d;
						// spinAudio.currentTime = 0;
						// spinAudio.pause();
						// spinAudio.play();

						// функция начала воспроизведения

						// создаем источник
						source = context.createBufferSource();
						// подключаем буфер к источнику
						source.buffer = buffer;
						// дефолтный получатель звука
						destination = context.destination;
						// подключаем источник к получателю
						source.connect(destination);
						// воспроизводим
						source.start(0);
					}
				},
				onComplete: function () {
					gsap.to(".game__drum", {
						rotation: now * d,
						duration: 0.01,
					});
					// !!! Сюда можно засунуть ajax обновляющий данные о прокрутке на сервер. Вся актуальная информация хранится в переменной user
					Cookies.set("user", JSON.stringify(user));
					setTimeout(function () {
						if (user.spin == 0) {
							if (user.winner) {
								setTimeout(function () {
									winAudio.currentTime = 0;
									winAudio.play();
								}, 300);

								$(".game__particle").addClass("_show");
								setTimeout(function () {
									$(".game__particle").removeClass("_show");
									$("#pickgift").fadeIn();
								}, 1500);
							} else {
								$("#final").fadeIn();
							}
						} else {
							videoOpen("#video-" + now);
						}
						isSpin = false;
					}, 1000);
				},
			});
		}

		$(".screen-game__col-spin").text(user.spin);
		console.log("user", user);
	});
	function videoOpen(id) {
		console.log("video", id);
		let videowrap = $(id);
		let video = videowrap.find(".popup-video__video")[0];
		let progress = videowrap.find(".popup-video__progress");
		videowrap.addClass("_open");
		setTimeout(() => {
			video.play();
		}, 400);
		video.addEventListener("ended", function () {
			videowrap.removeClass("_open");
		});
		video.addEventListener("timeupdate", function () {
			if (!isNaN(this.duration)) {
				var percent_complete = 100 * (this.currentTime / this.duration);
				progress.css("width", percent_complete + "%");
				if (percent_complete > 99.8) {
					videowrap.removeClass("_open");
				}
			}
		});
	}

	$("[data-video]").click(function () {
		videoOpen($(this).data("video"));
	});

	// $(".popup-video").click(function () {
	// 	let video = $(this).find("video")[0];
	// 	if (!video.paused) {
	// 		video.pause();
	// 	} else {
	// 		video.play();
	// 	}
	// });
});
