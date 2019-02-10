import { webservice } from '../api/webservice'

export class TextAnalysis {
  
  static async AnalyseSentimentalFromPhrases (phrases) {
    try {
      let response = await webservice().post(`analise/emocaodefrases/`, phrases)
      return response
    } catch (ex) {
      throw ex
    }
  }

  static async getTweets (text) {
    const obj ={
      text: text
    }

    try {
      let response = await webservice().post(`analise/getTweets/`, obj)
      return response
    } catch (ex) {
      throw ex
    }
  }

}