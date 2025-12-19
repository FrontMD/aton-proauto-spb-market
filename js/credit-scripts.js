document.addEventListener('DOMContentLoaded', function() {
    creditCalculator()
    anchorsInit();
    spoilers();
    gallerySlider();
})

// Кредитный калькулятор
function creditCalculator() {
    const creditCalculators = document.querySelectorAll('[data-js="creditCalculator"]')

    if(creditCalculators.length < 1) return

    creditCalculators.forEach(creditCalculator => {
        const rangeFields = creditCalculator.querySelectorAll('[data-js="fieldRange"]')
        const paymentResult = creditCalculator.querySelector('[data-js="paymentResult"]') 

        if(rangeFields.length > 1) {
            const formater = {
                from: function (formattedValue) {
                    return Number(formattedValue);
                },
                to: function (numericValue) {
                    return Math.round(numericValue);
                },
                };
        
            rangeFields.forEach(rangeField => {
                const slider = rangeField.querySelector('[data-js="fieldRangeSlider"]');
                if(!slider.noUiSlider) {
                    const min = parseInt(rangeField.dataset.min);
                    const max = parseInt(rangeField.dataset.max);
                    const step = parseInt(rangeField.dataset.step);
                    
                    let inputsList = [
                        rangeField.querySelector('[data-js="fieldRangeValue"]')
                    ]
        
                    let sliderEx = false
                    
                   sliderEx = noUiSlider.create(slider, {
                            start: min,
                            format: formater,
                            connect: 'lower',
                            step: step,
                            range: {
                                'min': min,
                                'max': max
                            }
                        });
        
                    sliderEx.on("update", function (values, handle) {
                        inputsList[handle].value = values[handle]
                        inputsList[handle].dispatchEvent(new Event('change'));

                        setPaymentResult()
                    });
        
                    inputsList.forEach((currentInput, index) => {
                        if(index == 0) {
                            currentInput.addEventListener('input', function() {
                                sliderEx.set([this.value, null])
                            })
                        } else if(index == 1) {
                            currentInput.addEventListener('input', function() {
                                sliderEx.set([null, this.value])
                            })
                        }
        
                        currentInput.addEventListener('keydown', function(e) {
                            if (e.keyCode === 13) {
                                e.preventDefault()
                                e.stopPropagation()
                                this.blur()
                            }
                        })
                    })
                }
                
            })

            function setPaymentResult() {
                const sum = parseInt(creditCalculator.querySelector('[data-name="fieldRangeSum"]').value)
                const term = parseInt(creditCalculator.querySelector('[data-name="fieldRangeTerm"]').value)
                paymentResult.innerHTML = Math.round(sum / term).toLocaleString()
            }
        }
         
    })

    creditSynchronizer()

}

// Синхронизация калькуляторов
function creditSynchronizer() {
    const groupSum = document.querySelectorAll('[data-js="fieldRangeSlider"][data-group="sum"]')
    const groupTerm = document.querySelectorAll('[data-js="fieldRangeSlider"][data-group="term"]')

    if(groupSum.length > 1) {
        const gs1 = groupSum[0]
        const gs2 = groupSum[1]

        let isSyncing = false;

        gs1.noUiSlider.on('update', (values, handle) => {
            if (isSyncing) return;
            isSyncing = true;
            gs2.noUiSlider.set(values[handle]);
            isSyncing = false;
        });

        gs2.noUiSlider.on('update', (values, handle) => {
            if (isSyncing) return;
            isSyncing = true;
            gs1.noUiSlider.set(values[handle]);
            isSyncing = false;
        });
    }

    if(groupTerm.length > 1) {
        const gt1 = groupTerm[0]
        const gt2 = groupTerm[1]

        let isSyncing = false;

        gt1.noUiSlider.on('update', (values, handle) => {
            if (isSyncing) return;
            isSyncing = true;
            gt2.noUiSlider.set(values[handle]);
            isSyncing = false;
        });

        gt2.noUiSlider.on('update', (values, handle) => {
            if (isSyncing) return;
            isSyncing = true;
            gt1.noUiSlider.set(values[handle]);
            isSyncing = false;
        });
    }
}

// якорные ссылки
function anchorsInit() {

    const anchors = document.querySelectorAll('a[href^="#"]');

    if(anchors.length < 1) return

    anchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const anchorName = this.getAttribute('href').replace('#', '');
            const targetEl = document.getElementById(anchorName);
            let scrollTopOffset = document.querySelector('header.header') ? document.querySelector('header.header').offsetHeight : '0'

            const targetElPos = Math.ceil($(targetEl).offset().top - scrollTopOffset)

            window.scrollTo({
                top: targetElPos,
                behavior: 'smooth'
            })
    
        });
    });
}

//аккордеон
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
			const content = $(spoiler).find('[data-js="spoilerContent"]');
			spoiler.classList.add("active");
			$(content).slideDown(400, () => {
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

// Слайдер-галерея
function gallerySlider() {
    const gallerySliders = document.querySelectorAll('[data-js="gallerySlider"]')

    if(gallerySliders.length < 1) return

    gallerySliders.forEach(slider => {
        const slides = slider.querySelectorAll('[data-js="gallerySliderSlide"]')
        const tabs = slider.querySelectorAll('[data-js="gallerySliderTab"]')

        if(slides.length > 0 && tabs.length > 0) {
            tabs.forEach((tab, index) => {
                tab.addEventListener('click', () => {
                    tabs.forEach(tab => {
                    tab.classList.remove('is-active')    
                    })
                    tab.classList.add('is-active')
                    slides.forEach((slide, i) => {
                        if(i == index) {
                            slide.classList.add('is-active')
                        } else {
                            slide.classList.remove('is-active')
                        }
                    })
                })
                tab.addEventListener('mouseenter', () => {
                    tabs.forEach(tab => {
                    tab.classList.remove('is-active')    
                    })
                    tab.classList.add('is-active')
                    slides.forEach((slide, i) => {
                        if(i == index) {
                            slide.classList.add('is-active')
                        } else {
                            slide.classList.remove('is-active')
                        }
                    })
                })
            })
        } 
    })
}