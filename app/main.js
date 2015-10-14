define([
    "jquery", 
    "knockout", 
    "flowchart", 
    "raphael", 
    "clipboard"
], 
function($, ko, flowchart, Raphael, Clipboard) {
  //TODO: Add clipboard binding handler
  
  var ViewModel = function(ns) {
    var self = this;
    var key = (ns||'diagrams');
    var chart = null;
    var savesValue = window.localStorage.getItem(key);
    var saves = (savesValue) ? JSON.parse(savesValue) : [];
    
    self.title = ko.observable((localStorage.getItem(key+'-title')||''));
    self.code = ko.observable((localStorage.getItem(key+'-code')||''));
    self.diagrams = ko.observableArray(saves);
    
    self.save = function() {
      var index = -1;
      console.log('save');
      if (!self.title() || !self.code()) { return; }
      for(var x in self.diagrams()) {
        if (self.diagrams()[x].title == self.title()) {
          index = x; 
          break;
        }
      }
      if (index == -1) {
        self.diagrams.push({title:self.title(),code:self.code()});
      } else {
        self.diagrams()[index].code = self.code();
      }
      window.localStorage.setItem(key, JSON.stringify(self.diagrams()));
    };
    
    self.autoSave = function() {
      window.localStorage.setItem(key+'-title', self.title());
      window.localStorage.setItem(key+'-code', self.code());
    };
    
    self.load = function(item) {
      self.title(item.title);
      self.code(item.code);
    };
    
    self.delete = function(item) {
      self.diagrams.remove(function(match){
        return match.title == item.title &&
          match.code == item.code;
      });
      window.localStorage.setItem(key, JSON.stringify(self.diagrams()));
    };
    
    self.refreshDiagram = ko.computed(function() {
      console.log('refresh Diagram');
      var text = self.code();
      if (!text) { return; }
      if (chart) {
        chart.clean();
      }
      
      try {
      chart = flowchart.parse(text);
      chart.drawSVG('diagram', {
            // 'x': 30,
            // 'y': 50,
            'line-width': 3,
            'line-length': 50,
            'text-margin': 10,
            'font-size': 14,
            'font': 'normal',
            'font-family': 'Helvetica',
            'font-weight': 'normal',
            'font-color': 'black',
            'line-color': 'black',
            'element-color': 'black',
            'fill': 'yellow',
            'yes-text': 'yes',
            'no-text': 'no',
            'arrow-end': 'block',
            'scale': 1,
            'symbols': {
              'start': {
                'font-color': 'white',
                'element-color': 'black',
                'fill': 'black'
              },
              'end':{
                'font-color': 'white',
                'element-color': 'black',
                'fill': 'black'
              }
            },
            'flowstate' : {
              'future' : { /* built in style name */},
              'path-b' : { 'fill': 'orange'},
              'approved' : { 'fill' : '#58C4A3', 'font-size' : 12, 'yes-text' : 'APPROVED', 'no-text' : 'n/a' },
              'rejected' : { 'fill' : '#C45879', 'font-size' : 12, 'yes-text' : 'n/a', 'no-text' : 'REJECTED' }
            }
          });
          
      } catch(ex) {
        $('#diagram').empty();
        chart = null;
        console.log(ex);
      }
        
      self.autoSave();
      return text;
    }).extend({
      rateLimit: { 
          timeout: 500
      } 
    });
  };
  
  var viewModel = new ViewModel();
  //viewModel.refreshDiagram();
  
  ko.applyBindings(viewModel, $('html')[0]);
  
});
