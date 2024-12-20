var Alternative = function (text, s, b, h) {
    this.answer = text;
    this.science = s;
    this.biological = b;
    this.humanities = h;
};

var Question = function (text, alternatives) {
    this.question = text;
    this.alternatives = alternatives;
    this.answer = 0; 
};

var App = {
    questions: new Array(),
    answers: new Array(),
    currentIndex: 0,

    getQuestion: function (index) {
        if (this.questions.length > index) {
            return this.questions[index];
        }
    },

    render: function () {
        var question = this.getQuestion(this.currentIndex);

        var container = $("div#body_content");
        container.html('');

        container.append("<h3 style='text-align: center'>" + question.question + "</h3>");

        for (var i = 0; i < question.alternatives.length; i++) {
            container.append(
                "<a id=\"alternative_" + i + "\" data-role=\"button\" data-theme=\"b\" href=\"javascript:void(0)\" data-icon=\"forward\" data-iconpos=\"right\" data-index=\"" + i + "\">" +
                    question.alternatives[i].answer +
                    "</a>"
            );

            $("a#alternative_" + i).on("click", function () {
                var idx = $(this).attr("data-index");
                question.answer = idx; 
                App.next();
            });

            $("div#body_content").trigger('create');
        }
    },

    next: function () {
        if (this.questions.length > this.currentIndex + 1) {
            ++this.currentIndex;
            this.render();
        } else {
            this.result();
        }
    },

    previous: function() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.render();
        }
    },

    result: function () {
        var science = 0;
        var biological = 0;
        var humanities = 0;

        for (var i = 0; i < this.questions.length; i++) {
            var selectedAlt = this.questions[i].alternatives[this.questions[i].answer];
            science += selectedAlt.science;
            biological += selectedAlt.biological;
            humanities += selectedAlt.humanities;
        }

        var container = $("div#body_content");
        container.html('');

        container.append("<h3 style='text-align: center'>Resultado</h3>");
        container.append("<div id='result_content' style='text-align: center;'><center>");
        container.append("<div id=\"chart1\" style=\"width:300px; height:300px;\"></div><pre class=\"code brush:js\"></pre>");
        container.append("</center></div>");

        $.jqplot.config.enablePlugins = true;
        var s1 = [science, biological, humanities];
        var ticks = ['Exatas', 'Biológicas', 'Humanas'];

        plot1 = $.jqplot('chart1', [s1], {
            animate: !$.jqplot.use_excanvas,
            seriesDefaults: {
                renderer: $.jqplot.BarRenderer,
                pointLabels: { show: false }
            },
            axes: {
                xaxis: {
                    renderer: $.jqplot.CategoryAxisRenderer,
                    ticks: ticks
                }
            },
            highlighter: { show: false }
        });

        var max = Math.max(science, biological, humanities);
        if (max == science) {
            container.append("<h5 style='text-align: center'>Você parece ter bastante aptidão para as <b>Ciências Exatas. Confira alguns cursos que a <a href=\"https://fadesa.edu.br/todososcursos/\" target=\"_blank\" data-transition=\"turn\">FADESA</a> oferece nesta área: </h5>");
            container.append("<h5 style='text-align: center'>Análise e Desenvolvimento de Sistemas, Administração e Ciências Contábeis.</h5>");
        } else if (max == humanities) {
            container.append("<h5 style='text-align: center'>Você parece ter bastante aptidão para as <b>Ciências Humanas. Confira alguns cursos que a <a href=\"https://fadesa.edu.br/todososcursos/\" target=\"_blank\" data-transition=\"turn\">FADESA</a> oferece nesta área: </h5>");
            container.append("<h5 style='text-align: center'>Direito, Pedagogia e Psicologia.</h5>");
        } else if (max == biological) {
            container.append("<h5 style='text-align: center'>Você parece ter bastante aptidão para as <b>Ciências Biológicas. Confira alguns cursos que a <a href=\"https://fadesa.edu.br/todososcursos/\" target=\"_blank\" data-transition=\"turn\">FADESA</a> oferece nesta área: </h5>");
            container.append("<h5 style='text-align: center'>Educação Física, Enfermagem, Nutrição, Odontologia</h5>");
        }

        container.append("<h5 style='text-align: center'><a href=\"https://fadesa.edu.br/todososcursos/\" target=\"_blank\" data-transition=\"turn\">Clique aqui para acessar o site da FADESA e obter mais informações sobre cursos na sua área.</a></h5>");
    },

    init: function () {
        var questions = [
            new Question(
                "Quais são as qualidades que você mais admira em uma pessoa?",
                [
                    new Alternative("Inteligência e raciocínio", 3, 1, 2),
                    new Alternative("Carisma e capacidade de lidar com pessoas", 1, 2, 3),
                    new Alternative("Sabedoria e experiência de vida", 1, 2, 2)
                ]
            ),
            new Question(
                "Na escola, a categoria de disciplinas que você mais gosta/gostava é:",
                [
                    new Alternative("Matemática e Física", 2, 0, 0),
                    new Alternative("História, Geografia e Artes", 0, 0, 2),
                    new Alternative("Esportes, Biologia e Química", 0, 2, 0)
                ]
            ),
           
        ];

        this.questions = questions;

        this.render();
    }
};

$(document).on("pageinit", "#home", function(event) {
    App.init();

    $("a#back_button").on("click", function() {
        App.previous();
    });
});