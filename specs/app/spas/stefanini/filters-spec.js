(function() {
  "use strict";
  angular.module("stefanini.filters", []).filter("filters", function($filter) {
    var Filtro = {};
    var mesesDoAno = [
      "jan",
      "fev",
      "mar",
      "abr",
      "mai",
      "jun",
      "jul",
      "ago",
      "set",
      "out",
      "nov",
      "dez"
    ];

    Filtro.convData = function(entrada) {
      if (entrada === null) {
        return "";
      }
      var _data = $filter("date")(entrada, "dd-MM-yyyy");

      return _data.toUpperCase();
    };

    /*
     * Converte uma chave de usuário em matrícula
     */
    Filtro.converterMatricula = function(chave) {
      return parseInt(chave.replace(/\D/g, ""));
    };

    /**
     * Converte para float
     */
    Filtro.converterFloat = function() {
      return function(numero) {
        if (numero) {
          return parseFloat(numero.replace(",", "."));
        }
      };
    };

    /**
     * Converte Inteiro para Float
     */
    Filtro.converterInteiroParaFloat = function() {
      return function(numero) {
        if (numero) {
          return parseFloat(numero);
        }
      };
    };

    /*
     * Formata uma chave de usuário a partir de uma matrícula
     */
    Filtro.formatarChave = function(matricula) {
      matricula = matricula + "";
      return "F" + ("0000000" + matricula).substring(matricula.length);
    };

    /*
     * Adiciona caracteres à esquerda até completar o tamanho informado
     */
    Filtro.lpad = function(str, length, padString) {
      str = str + "";
      padString = padString || "0";
      while (str.length < length) str = padString + str;
      return str;
    };

    Filtro.mesAno = function(data, padrao) {
      data = data + "";

      if (!data) {
        return padrao || "";
      }

      var mes = parseInt(data.substring(3, 5));
      var ano = data.substring(6, 10);

      if (mes > 0 && ano !== "") {
        return mesesDoAno[mes - 1] + "/" + ano;
      }
      return data;
    };

    Filtro.capitalizeFirstWord = function(text) {
      if (!text) return "";
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    };

    Filtro.capitalizeEachWord = function(text) {
      if (!text) return "";
      var cfw = Filtro.capitalizeFirstWord(text);

      return text.replace(/[a-zA-Z\u00C0-\u00FF]+/gi, function(l) {
        cfw = l;
        return cfw;
      });
    };

    Filtro.formataMCI = function(text) {
      if (!text) return "";
      var dado = "" + text;
      while (dado.length < 11) {
        dado = "0" + dado;
      }
      dado =
        dado.substring(0, 3) +
        "." +
        dado.substring(3, 6) +
        "." +
        dado.substring(6, 9) +
        "-" +
        dado.substring(9, 11);
      return dado;
    };

    return Filtro;
  });
})();
