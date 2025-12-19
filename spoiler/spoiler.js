function spoilers() {
    const accordions = document.querySelectorAll("[data-js='accordion']");

	if(accordions.length < 1) return

	accordions.forEach(accordion => {

		let firstSpoiler = accordion.querySelector('[data-js="spoiler"]')

		if(firstSpoiler) {
			openSpoiler(firstSpoiler)
		}

		accordion.addEventListener('click', (e) => {
			let eventTarget = e.target

			if(eventTarget.closest('[data-js="spoiler"]')) {
				let clickedSpoiler = eventTarget.closest('[data-js="spoiler"]')

				if(clickedSpoiler.classList.contains('active')) {
					return
				}

				let spoilers = accordion.querySelectorAll('[data-js="spoiler"].active')
				let oldSpoilerHeight = $(spoilers[0]).find('[data-js="spoilerContent"]')[0].offsetHeight

				spoilers.forEach(spoiler => {
					closeSpoiler(spoiler)
				})

				openSpoiler(clickedSpoiler, oldSpoilerHeight)
			}
		})

		function openSpoiler(spoiler, oldSpoilerHeight = 0) {
			if(footerScrollTriggerObj) {
				footerScrollTriggerObj.disable()
			}
			const content = $(spoiler).find('[data-js="spoilerContent"]');
			spoiler.classList.add("active");
			$(content).slideDown(400, () => {
				if(footerScrollTriggerObj) {
					footerScrollTriggerObj.enable()
					footerScrollTriggerObj.refresh()
				}
				if(oldSpoilerHeight > window.innerHeight / 2) {
					let scrollTopOffset = document.querySelector('[data-js="siteHeader"]') ? document.querySelector('[data-js="siteHeader"]').offsetHeight : '0'
					let newPos = Math.ceil($(spoiler).offset().top - scrollTopOffset - 32)
					let currentPos = window.scrollY
					
					if(spoiler == firstSpoiler){
						newPos = 0;
					}

					let distance = currentPos - newPos;
					let step = distance > 0 ? -20 : 20;
					let counterStep = Math.abs(step)
					let counter = 0
					
					let scrollInterval = setInterval(() => {

						window.scrollBy({
							top: step,
							behavior: 'instant'
						})

						counter += counterStep

						if(counter >= Math.abs(distance)) {
							clearInterval(scrollInterval)
						}

					}, 10
					)
				} else {
					return
				}
			});

			spoiler.dispatchEvent(new CustomEvent('spoilerExpand'))
		};
	
		function closeSpoiler(spoiler) {
			const content = $(spoiler).find('[data-js="spoilerContent"]');
			spoiler.classList.remove("active");
			$(content).slideUp(400);
		};

	})

}