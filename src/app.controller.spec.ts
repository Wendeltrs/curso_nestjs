import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller'
import { AppService } from './app.service'

describe('AppController', () => {
  //describe: Cria um agrupamento para organizar os testes e identificá-los
  let appController: AppController

  beforeEach(async () => {
    //beforeEach: É um hook que executa uma função antes da execução de cada teste dentro do arquivo
    const app: TestingModule = await Test.createTestingModule({
      //createTestingModule: Cria um modulo de teste ficticio
      controllers: [AppController],
      providers: [AppService],
    }).compile()

    appController = app.get<AppController>(AppController) //Faz a instancia do controller, podendo usar suas funções
  })

  describe('HealthCheck', () => {
    it('should return "API is running"', () => {
      expect(appController.getHealthCheck()).toEqual({ message: "API is running" })
    })
  })
})
