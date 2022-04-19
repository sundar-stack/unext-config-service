import {buildProviderModule} from 'inversify-binding-decorators';
import {container} from './ioc';
import '../controllers';

container.load(buildProviderModule());
