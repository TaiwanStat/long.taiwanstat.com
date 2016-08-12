var tour = new Shepherd.Tour({
  defaults: {
      classes: 'shepherd-theme-arrows',
      scrollTo: true
    }
});
tour.addStep('example-step', {
  text: 'This step is attached to the bottom of the <code>.example-css-selector</code> element.',
  attachTo: '.mainItem bottom',
  classes: 'shepherd-theme-arrows',
  buttons: [
    {
      text: 'Next',
      action: tour.next
    }
  ]
});
//tour.start();
