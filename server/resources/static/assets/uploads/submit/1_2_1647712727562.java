package com.transaction.api.controller;

import com.transaction.api.service.AbstractService;
import org.springframework.web.bind.annotation.RequestMapping;


@RequestMapping("/api/v1")
public abstract class ATransactionController extends BaseController  {
    public ATransactionController(AbstractService abstractService) {
        super(abstractService);
    }
}
