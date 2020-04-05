angular
  .module("hackaton-stefanini")
  .directive("ngFiles", [
    "$parse",
    function ($parse) {
      function fn_link(scope, element, attrs) {
        var onChange = $parse(attrs.ngFiles);
        element.on("change", function (event) {
          onChange(scope, { $files: event.target.files });
        });
      }
      return {
        link: fn_link,
      };
    },
  ])
  .controller("PessoaIncluirAlterarController", PessoaIncluirAlterarController);
PessoaIncluirAlterarController.$inject = [
  "$rootScope",
  "$scope",
  "$location",
  "$q",
  "$filter",
  "$routeParams",
  "HackatonStefaniniService",
];

function PessoaIncluirAlterarController(
  $rootScope,
  $scope,
  $location,
  $q,
  $filter,
  $routeParams,
  HackatonStefaniniService
) {
  /**ATRIBUTOS DA TELA */
  vm = this;

  vm.pessoa = {
    id: null,
    nome: "",
    email: "",
    dataNascimento: null,
    enderecos: [],
    perfils: [],
    situacao: false,
    caminhoFoto: "",
  };
  vm.enderecoDefault = {
    id: null,
    idPessoa: null,
    cep: "",
    uf: "",
    localidade: "",
    bairro: "",
    logradouro: "",
    complemento: "",
  };

  vm.urlEndereco = "http://localhost:8080/treinamento/api/enderecos/";
  vm.urlPerfil = "http://localhost:8080/treinamento/api/perfils/";
  vm.urlPessoa = "http://localhost:8080/treinamento/api/pessoas/";
  vm.urlViaCep = "http://localhost:8080/treinamento/api/enderecos/buscar/";

  /**METODOS DE INICIALIZACAO */
  vm.init = function () {
    vm.tituloTela = "Cadastrar Pessoa";
    vm.acao = "Cadastrar";
    vm.tituloTelaEndereco = "Cadastrar Endereço";

    vm.acaoEnd = "Cadastrar";
    /**Recuperar a lista de perfil */
    vm.listar(vm.urlPerfil).then(function (response) {
      if (response !== undefined) {
        vm.listaPerfil = response;
        if ($routeParams.idPessoa) {
          vm.tituloTela = "Editar Pessoa";
          vm.acao = "Editar";
          vm.recuperarObjetoPorIDURL($routeParams.idPessoa, vm.urlPessoa).then(
            function (pessoaRetorno) {
              if (pessoaRetorno !== undefined) {
                vm.pessoa = pessoaRetorno;
                /*vm.pessoa.dataNascimento = vm.formataDataTela(
                  pessoaRetorno.dataNascimento
                );*/
                vm.perfil = vm.pessoa.perfils[0];
              }
            }
          );
        }
      }
    });
  };
  vm.getFiles = function ($files) {
    vm.pessoa.caminhoFoto = angular.copy($files[0].webkitRelativePath);
    console.log("Caminho da foto: ", vm.pessoa.caminhoFoto);
  };

  /**METODOS DE TELA */
  vm.cancelar = function () {
    vm.retornarTelaListagem();
  };

  vm.retornarTelaListagem = function () {
    $location.path("listarPessoas");
  };

  vm.retornarTelaPessoa = function () {
    $location.path("cadastrarPessoa");
  };

  vm.abrirModal = function (endereco) {
    vm.enderecoModal = vm.enderecoDefault;
    vm.enderecoModal.idPessoa = vm.pessoa.id;
    if (endereco !== undefined) {
      vm.acaoEnd = "Editar";
      vm.tituloTelaEndereco = "Editar Endereço";
      vm.enderecoModal = endereco;
    }
    if (vm.pessoa.enderecos.length === 0)
      vm.pessoa.enderecos.push(vm.enderecoModal);
    $("#modalEndereco").modal();
  };

  vm.limparTela = function () {
    $("#modalEndereco").modal("toggle");
    vm.endereco = undefined;
  };

  vm.incluirEndereco = function () {
    var endereco = angular.copy(vm.enderecoModal);
    if (vm.acaoEnd === "Cadastrar") {
      vm.salvar(vm.urlEndereco, endereco).then(function (endRetorno) {
        console.log("Salvar: ", endRetorno);
        alert("Agora cadastre o Perfil e salve novamente!");
        vm.obterIdPessoa(vm.pessoa.id);
      });
    } else if (vm.acaoEnd === "Editar") {
      vm.alterar(vm.urlEndereco, endereco).then(function (endRetorno) {
        vm.retornarTelaListagem();
      });
    }
  };
  vm.incluir = function () {
    var pessoa = angular.copy(vm.pessoa);
    if (vm.perfil !== null) {
      var isNovoPerfil = true;

      angular.forEach(pessoa.perfils, function (value, key) {
        if (value.id === vm.perfil.id) {
          console.log("value.id", value.id);
          console.log("vm.perfil.id", vm.perfil.id);
          isNovoPerfil = false;
        }
      });
      if (isNovoPerfil) {
        pessoa.perfils.push(vm.perfil);
      }
    }
    if (vm.acao === "Cadastrar") {
      pessoa.dataNascimento = vm.formataDataJava(vm.pessoa.dataNascimento);

      vm.salvar(vm.urlPessoa, pessoa).then(function (pessoaRetorno) {
        alert("Tem que cadastrar Endereço também!!");
        vm.obterIdPessoa(pessoaRetorno.id);
        console.log("Salvar: ", pessoaRetorno);
      });
    } else if (vm.acao === "Editar") {
      vm.alterar(vm.urlPessoa, pessoa).then(function (pessoaRetorno) {
        vm.retornarTelaListagem();
      });
    }
  };

  vm.pesqCep = function () {
    //vm.enderecoDefault.cep = "72236019";
    vm.viacep(vm.urlViaCep, vm.enderecoModal.cep).then(function (resposta) {
      vm.enderecoModal.uf = resposta.uf;
      vm.enderecoModal.localidade = resposta.localidade;
      vm.enderecoModal.bairro = resposta.bairro;
      vm.enderecoModal.logradouro = resposta.logradouro;
    });
  };

  vm.obterIdPessoa = function (id) {
    vm.pessoa.id = id;
    if (id !== undefined) $location.path("EditarPessoas/" + id);
    else $location.path("cadastrarPessoa");
  };
  vm.remover = function (objeto, tipo) {
    var url = vm.urlPessoa + objeto.id;
    if (tipo === "ENDERECO") url = vm.urlEndereco + objeto.id;

    vm.excluir(url).then(function (ojetoRetorno) {
      vm.retornarTelaListagem();
    });
  };

  vm.editar = function (objeto, tipo) {
    var url = vm.urlPessoa + objeto.id;
    if (tipo === "ENDERECO") url = vm.urlEndereco + objeto.id;

    vm.alterar(url).then(function (ojetoRetorno) {
      vm.retornarTelaListagem();
    });
  };

  /**METODOS DE SERVICO */
  vm.recuperarObjetoPorIDURL = function (id, url) {
    var deferred = $q.defer();
    HackatonStefaniniService.listarId(url + id).then(function (response) {
      if (response.data !== undefined) deferred.resolve(response.data);
      else deferred.resolve(vm.enderecoDefault);
    });
    return deferred.promise;
  };

  vm.listar = function (url) {
    var deferred = $q.defer();
    HackatonStefaniniService.listar(url).then(function (response) {
      if (response.data !== undefined) {
        deferred.resolve(response.data);
      }
    });
    return deferred.promise;
  };

  vm.viacep = function (url, objeto) {
    var deferred = $q.defer();
    var obj = JSON.stringify(objeto);
    HackatonStefaniniService.viacep(url, obj).then(function (response) {
      if (response.data !== undefined) {
        deferred.resolve(response.data);
      }
    });
    return deferred.promise;
  };

  vm.salvar = function (url, objeto) {
    var deferred = $q.defer();
    var obj = JSON.stringify(objeto);
    HackatonStefaniniService.incluir(url, obj).then(function (response) {
      if (response.status === 200) {
        deferred.resolve(response.data);
      }
    });
    return deferred.promise;
  };

  vm.alterar = function (url, objeto) {
    var deferred = $q.defer();
    var obj = JSON.stringify(objeto);
    HackatonStefaniniService.alterar(url, obj).then(function (response) {
      if (response.status === 200) {
        deferred.resolve(response.data);
      }
    });
    return deferred.promise;
  };

  vm.excluir = function (url, objeto) {
    var deferred = $q.defer();
    HackatonStefaniniService.excluir(url).then(function (response) {
      if (response.status == 200) {
        deferred.resolve(response.data);
      }
    });
    return deferred.promise;
  };

  /**METODOS AUXILIARES */
  vm.formataDataJava = function (data) {
    var dia = data.slice(0, 2);
    var mes = data.slice(2, 4);
    var ano = data.slice(4, 8);

    return dia + "/" + mes + "/" + ano;
  };

  vm.formataDataTela = function (data) {
    var ano = data.slice(0, 4);
    var mes = data.slice(5, 7);
    var dia = data.slice(8, 10);

    return dia + mes + ano;
  };

  vm.listaUF = [
    { id: "RO", desc: "RO" },
    { id: "AC", desc: "AC" },
    { id: "AM", desc: "AM" },
    { id: "RR", desc: "RR" },
    { id: "PA", desc: "PA" },
    { id: "AP", desc: "AP" },
    { id: "TO", desc: "TO" },
    { id: "MA", desc: "MA" },
    { id: "PI", desc: "PI" },
    { id: "CE", desc: "CE" },
    { id: "RN", desc: "RN" },
    { id: "PB", desc: "PB" },
    { id: "PE", desc: "PE" },
    { id: "AL", desc: "AL" },
    { id: "SE", desc: "SE" },
    { id: "BA", desc: "BA" },
    { id: "MG", desc: "MG" },
    { id: "ES", desc: "ES" },
    { id: "RJ", desc: "RJ" },
    { id: "SP", desc: "SP" },
    { id: "PR", desc: "PR" },
    { id: "SC", desc: "SC" },
    { id: "RS", desc: "RS" },
    { id: "MS", desc: "MS" },
    { id: "MT", desc: "MT" },
    { id: "GO", desc: "GO" },
    { id: "DF", desc: "DF" },
  ];
}
