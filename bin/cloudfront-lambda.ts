#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { CloudfrontLambdaStack } from "../lib/cloudfront-lambda-stack";
import { CloudfrontS3Stack } from "../lib/cloudfront-s3-stack";

const app = new cdk.App();

new CloudfrontLambdaStack(app, "CloudfrontLambda");
new CloudfrontS3Stack(app, "CloudfrontS3");
