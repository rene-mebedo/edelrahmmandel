import { Meteor } from 'meteor/meteor';
import { ServiceMaintenances } from '/imports/api/collections/serviceMaintenances';

Meteor.publish('servicemaintenances', function publishServiceMaintenances() {
    return ServiceMaintenances.find({});
});