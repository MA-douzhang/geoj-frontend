/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_AnswerAi_ } from '../models/BaseResponse_AnswerAi_';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class QuestionAiControllerService {

    /**
     * getAnswerAi
     * @param id id
     * @returns BaseResponse_AnswerAi_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static getAnswerAiUsingPost(
id?: number,
): CancelablePromise<BaseResponse_AnswerAi_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/ai/get/submit/ai',
            query: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
