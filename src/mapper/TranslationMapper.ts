import moment from 'moment';

export class TranslationMapper{

    async ModeltoDTO(models: any, context: any): Promise<any> {
        var dtos:any = [];
        console.log('Check model data :',models);
        
        for (var model of models) {
            var dto: any = {
                TranslationId: model.id,
                TranslationCode: model.translationcodeid,
                TranslationText: model.languagetext,
                LocaleId: model.localeid,
            };

            dtos.push(dto);
        };
        console.log('dtos before return :',dtos);
        
        return dtos;
    }

}